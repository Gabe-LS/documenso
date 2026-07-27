import { cancelDocument } from '@documenso/lib/server-only/document/cancel-document';
import { rejectDocumentWithToken } from '@documenso/lib/server-only/document/reject-document-with-token';
import { sendDocument } from '@documenso/lib/server-only/document/send-document';
import { prisma } from '@documenso/prisma';
import { seedDraftDocument } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { test } from '@playwright/test';
import { FieldType, Prisma, ReadStatus, RecipientRole, SendStatus, SigningStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

import { signSignaturePad } from '../fixtures/signature';

const INBUCKET = 'http://localhost:9000';
const META = { auth: null, requestMetadata: {}, source: 'app' as const };

const mailboxOf = (address: string) => address.split('@')[0];

const dumpMailbox = async (label: string, address: string) => {
  const list = await fetch(`${INBUCKET}/api/v1/mailbox/${mailboxOf(address)}`).then((r) => r.json());

  console.log(`\n########## ${label}  <${address}>  (${list.length} message(s)) ##########`);

  for (const msg of list) {
    const full = await fetch(`${INBUCKET}/api/v1/mailbox/${mailboxOf(address)}/${msg.id}`).then((r) => r.json());
    const text = (full.body?.text ?? '').replace(/\n{3,}/g, '\n\n').trim();

    console.log(`\n--- SUBJECT: ${msg.subject}`);
    console.log(`--- FROM: ${msg.from}`);
    console.log(text.slice(0, 1_600));
  }
};

/** Build an Italian-language document with a signer and a CC, and send it. */
const makeItalianDoc = async (owner: Awaited<ReturnType<typeof seedUser>>['user'], teamId: number, tag: string) => {
  const signerEmail = `it-${tag}-signer@example.com`;
  const ccEmail = `it-${tag}-cc@example.com`;

  const envelope = await seedDraftDocument(owner, teamId, [signerEmail], { key: tag });

  await prisma.documentMeta.update({
    where: { id: envelope.documentMetaId as string },
    data: { language: 'it' },
  });

  const signer = await prisma.recipient.findFirstOrThrow({
    where: { envelopeId: envelope.id, email: signerEmail },
  });

  await prisma.field.create({
    data: {
      page: 1,
      type: FieldType.SIGNATURE,
      inserted: false,
      customText: '',
      positionX: new Prisma.Decimal(10),
      positionY: new Prisma.Decimal(10),
      width: new Prisma.Decimal(20),
      height: new Prisma.Decimal(10),
      envelopeId: envelope.id,
      envelopeItemId: envelope.envelopeItems[0].id,
      recipientId: signer.id,
    },
  });

  await prisma.recipient.create({
    data: {
      email: ccEmail,
      name: 'Destinatario CC',
      token: nanoid(),
      role: RecipientRole.CC,
      readStatus: ReadStatus.NOT_OPENED,
      sendStatus: SendStatus.NOT_SENT,
      signingStatus: SigningStatus.NOT_SIGNED,
      envelopeId: envelope.id,
    },
  });

  await sendDocument({
    id: { type: 'envelopeId', id: envelope.id },
    userId: owner.id,
    teamId,
    sendEmail: true,
    requestMetadata: META,
  });

  return { envelope, signerEmail, ccEmail, signer };
};

test('[REVIEW] lifecycle email copy in Italian', async ({ page }) => {
  test.setTimeout(300_000);

  const { user: owner, team } = await seedUser({ name: 'Mario Bianchi' });
  await prisma.team.update({ where: { id: team.id }, data: { name: 'Studio Notarile Verdi' } });

  // ============================================ A: send + complete ==========
  const a = await makeItalianDoc(owner, team.id, 'aa');

  await page.goto(`/sign/${a.signer.token}`);
  await signSignaturePad(page);

  const aFields = await prisma.field.findMany({ where: { recipientId: a.signer.id }, orderBy: { id: 'asc' } });
  for (const f of aFields) {
    await page.locator(`#field-${f.id}`).getByRole('button').click();
  }
  await page.getByRole('button', { name: 'Complete' }).click();
  await page.getByRole('button', { name: 'Sign' }).click();
  await page.waitForURL(`/sign/${a.signer.token}/complete`, { timeout: 30_000 });

  // ================================================== B: cancelled ==========
  const b = await makeItalianDoc(owner, team.id, 'bb');
  await cancelDocument({
    id: { type: 'envelopeId', id: b.envelope.id },
    userId: owner.id,
    teamId: team.id,
    reason: 'Accordo superato',
    requestMetadata: META,
  });

  // =================================================== C: rejected ==========
  const c = await makeItalianDoc(owner, team.id, 'cc');
  await rejectDocumentWithToken({
    token: c.signer.token,
    id: { type: 'envelopeId', id: c.envelope.id },
    reason: 'Condizioni non concordate',
    requestMetadata: META,
  });

  await new Promise((r) => setTimeout(r, 6_000));

  await dumpMailbox('A — SIGNER (invite + completed)', a.signerEmail);
  await dumpMailbox('A — CC (sent-for-signing + completed)', a.ccEmail);
  await dumpMailbox('B — SIGNER (invite + cancelled)', b.signerEmail);
  await dumpMailbox('B — CC (sent-for-signing + cancelled)', b.ccEmail);
  await dumpMailbox('C — SIGNER (invite + rejection confirmed)', c.signerEmail);
  await dumpMailbox('C — CC (sent-for-signing + rejected)', c.ccEmail);
  await dumpMailbox('OWNER', owner.email);
});

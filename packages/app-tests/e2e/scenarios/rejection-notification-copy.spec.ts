import { rejectDocumentWithToken } from '@documenso/lib/server-only/document/reject-document-with-token';
import { sendDocument } from '@documenso/lib/server-only/document/send-document';
import { prisma } from '@documenso/prisma';
import { seedDraftDocument } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { expect, test } from '@playwright/test';
import { FieldType, Prisma, ReadStatus, RecipientRole, SendStatus, SigningStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

const INBUCKET = 'http://localhost:9000';
const META = { auth: null, requestMetadata: {}, source: 'app' as const };

const mailbox = async (address: string) => {
  const local = address.split('@')[0];
  const list = await fetch(`${INBUCKET}/api/v1/mailbox/${local}`).then((r) => r.json());

  return Promise.all(
    list.map(async (m: { id: string; subject: string }) => {
      const full = await fetch(`${INBUCKET}/api/v1/mailbox/${local}/${m.id}`).then((r) => r.json());
      return { subject: m.subject, text: (full.body?.text ?? '').trim() };
    }),
  );
};

test('[E2] a rejection must not be reported as the sender cancelling', async ({ page: _page }) => {
  test.setTimeout(180_000);

  const { user: owner, team } = await seedUser({ name: 'Mario Bianchi' });
  await prisma.team.update({ where: { id: team.id }, data: { name: 'Studio Notarile Verdi' } });

  const tag = `e2fix-${nanoid(8)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')}`;
  const signerEmail = `${tag}-signer@example.com`;
  const otherEmail = `${tag}-other@example.com`;
  const ccEmail = `${tag}-cc@example.com`;

  const envelope = await seedDraftDocument(owner, team.id, [signerEmail, otherEmail], { key: tag });

  await prisma.documentMeta.update({
    where: { id: envelope.documentMetaId as string },
    data: { language: 'it' },
  });

  for (const email of [signerEmail, otherEmail]) {
    const r = await prisma.recipient.findFirstOrThrow({ where: { envelopeId: envelope.id, email } });
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
        recipientId: r.id,
      },
    });
  }

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
    teamId: team.id,
    sendEmail: true,
    requestMetadata: META,
  });

  const signer = await prisma.recipient.findFirstOrThrow({
    where: { envelopeId: envelope.id, email: signerEmail },
  });

  await prisma.recipient.update({ where: { id: signer.id }, data: { name: 'Luca Ferrari' } });

  await rejectDocumentWithToken({
    token: signer.token,
    id: { type: 'envelopeId', id: envelope.id },
    reason: 'Condizioni non concordate',
    requestMetadata: META,
  });

  await new Promise((r) => setTimeout(r, 6_000));

  for (const [label, address] of [
    ['CC', ccEmail],
    ['OTHER SIGNER', otherEmail],
  ] as const) {
    const messages = await mailbox(address);
    const last = messages[messages.length - 1];

    console.log(`\n===== ${label} — last message =====`);
    console.log('SUBJECT:', last.subject);
    console.log(last.text.slice(0, 700));

    expect(last.subject.toLowerCase(), `${label} subject must not say cancelled`).not.toContain('annullat');
    expect(last.text.toLowerCase(), `${label} body must not blame the sender`).not.toContain(
      'ha annullato il documento',
    );
    expect(last.text.toLowerCase(), `${label} must be told it was rejected`).toContain('rifiut');
  }
});

import { cancelDocument } from '@documenso/lib/server-only/document/cancel-document';
import { sendDocument } from '@documenso/lib/server-only/document/send-document';
import { prisma } from '@documenso/prisma';
import { seedDraftDocument } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { expect, test } from '@playwright/test';
import { FieldType, Prisma, ReadStatus, RecipientRole, SendStatus, SigningStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

const INBUCKET = 'http://localhost:9000';
const META = { auth: null, requestMetadata: {}, source: 'app' as const };

const VOIDED_IT = 'tutte le firme apposte sul documento sono state annullate';

/**
 * Waits for a specific message rather than merely for the mailbox to be
 * non-empty. The signing invite always lands first, so polling on "any mail
 * arrived" reads the invite and asserts against the wrong email whenever the
 * cancellation job is still in flight — which is exactly what happens when the
 * suite runs with more than one worker.
 */
const messageMatching = async (address: string, subjectIncludes: string) => {
  const local = address.split('@')[0];
  let list: { id: string; subject: string }[] = [];

  for (let attempt = 0; attempt < 45; attempt++) {
    list = await fetch(`${INBUCKET}/api/v1/mailbox/${local}`).then((r) => r.json());

    const hit = list.find((m) => m.subject.toLowerCase().includes(subjectIncludes.toLowerCase()));

    if (hit) {
      const full = await fetch(`${INBUCKET}/api/v1/mailbox/${local}/${hit.id}`).then((r) => r.json());

      return { subject: hit.subject, text: (full.body?.text ?? '').trim() };
    }

    await new Promise((r) => setTimeout(r, 1_000));
  }

  throw new Error(
    `No message matching "${subjectIncludes}" for ${address}; saw: ${list.map((m) => m.subject).join(' | ') || '(nothing)'}`,
  );
};

const buildAndSend = async (owner: Awaited<ReturnType<typeof seedUser>>['user'], teamId: number, tag: string) => {
  const signerEmail = `${tag}-signer@example.com`;
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

  // A CC recipient is deliberately included: CC recipients are persisted with
  // signingStatus SIGNED at creation time, so a check based on signingStatus
  // reports "somebody signed" on every document that has a CC — which is every
  // real document in this fork. Without a CC here the test passes against a
  // broken predicate.
  await prisma.recipient.create({
    data: {
      email: `${tag}-cc@example.com`,
      name: 'Destinatario CC',
      token: nanoid(),
      role: RecipientRole.CC,
      readStatus: ReadStatus.NOT_OPENED,
      sendStatus: SendStatus.NOT_SENT,
      signingStatus: SigningStatus.SIGNED,
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

  return { envelope, signerEmail, signer };
};

test('[E6] cancellation only claims voided signatures when some exist', async () => {
  test.setTimeout(180_000);

  const { user: owner, team } = await seedUser({ name: 'Mario Bianchi' });
  await prisma.team.update({ where: { id: team.id }, data: { name: 'Studio Notarile Verdi' } });

  const run = nanoid(6)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  // ---- Case 1: nobody signed -------------------------------------------
  const unsigned = await buildAndSend(owner, team.id, `e6none-${run}`);

  await cancelDocument({
    id: { type: 'envelopeId', id: unsigned.envelope.id },
    userId: owner.id,
    teamId: team.id,
    reason: 'Accordo superato',
    requestMetadata: META,
  });

  // ---- Case 2: the signer completed first -------------------------------
  const signed = await buildAndSend(owner, team.id, `e6some-${run}`);

  await prisma.recipient.update({
    where: { id: signed.signer.id },
    data: { signingStatus: SigningStatus.SIGNED, signedAt: new Date() },
  });

  // Create a real Signature row, not just the status. The handler counts actual
  // signatures precisely because signingStatus lies: CC recipients and
  // marked-as-viewed recipients both carry SIGNED without having signed.
  const signedField = await prisma.field.findFirstOrThrow({
    where: { recipientId: signed.signer.id, type: FieldType.SIGNATURE },
  });

  await prisma.signature.create({
    data: {
      recipientId: signed.signer.id,
      fieldId: signedField.id,
      typedSignature: 'Luca Ferrari',
    },
  });

  await cancelDocument({
    id: { type: 'envelopeId', id: signed.envelope.id },
    userId: owner.id,
    teamId: team.id,
    reason: 'Accordo superato',
    requestMetadata: META,
  });

  // Wait for the cancellation specifically; the invite is already in the mailbox.
  const noneMail = await messageMatching(unsigned.signerEmail, 'annullato');
  const someMail = await messageMatching(signed.signerEmail, 'annullato');

  console.log('\n===== NOBODY SIGNED =====');
  console.log(noneMail.subject);
  console.log(noneMail.text.slice(0, 500));

  console.log('\n===== SOMEONE SIGNED =====');
  console.log(someMail.subject);
  console.log(someMail.text.slice(0, 500));

  expect(noneMail.text.toLowerCase(), 'must not claim signatures were voided').not.toContain(VOIDED_IT);
  expect(someMail.text.toLowerCase(), 'must still say so when signatures exist').toContain(VOIDED_IT);

  // The rest of the cancellation copy must survive in both cases.
  for (const mail of [noneMail, someMail]) {
    expect(mail.text.toLowerCase()).toContain('ha annullato il documento');
    expect(mail.text.toLowerCase()).toContain("motivo dell'annullamento");
  }
});

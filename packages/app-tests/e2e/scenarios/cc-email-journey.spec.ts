import { sendDocument } from '@documenso/lib/server-only/document/send-document';
import { prisma } from '@documenso/prisma';
import { seedDraftDocument } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { expect, test } from '@playwright/test';
import { FieldType, Prisma, ReadStatus, RecipientRole, SendStatus, SigningStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

import { signSignaturePad } from '../fixtures/signature';

const INBUCKET = 'http://localhost:9000';

type InbucketMessage = {
  id: string;
  from: string;
  subject: string;
  date: string;
};

/** Inbucket's default mailbox naming is `local` — the part before the `@`. */
const mailboxOf = (address: string) => address.split('@')[0];

const listMailbox = async (address: string): Promise<InbucketMessage[]> => {
  const res = await fetch(`${INBUCKET}/api/v1/mailbox/${mailboxOf(address)}`);

  if (!res.ok) {
    throw new Error(`Inbucket list failed for ${address}: ${res.status}`);
  }

  return await res.json();
};

const readMessage = async (address: string, id: string) => {
  const res = await fetch(`${INBUCKET}/api/v1/mailbox/${mailboxOf(address)}/${id}`);

  if (!res.ok) {
    throw new Error(`Inbucket read failed for ${address}/${id}: ${res.status}`);
  }

  return await res.json();
};

/** Poll until the mailbox has at least `count` messages, or time out. */
const waitForMail = async (address: string, count = 1, timeoutMs = 30_000) => {
  const deadline = Date.now() + timeoutMs;

  for (;;) {
    const messages = await listMailbox(address);

    if (messages.length >= count) {
      return messages;
    }

    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for ${count} message(s) at ${address}; saw ${messages.length}`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }
};

test('[CC] signer and CC both receive the full document lifecycle', async ({ page }) => {
  test.setTimeout(180_000);

  const { user: owner, team } = await seedUser();

  const suffix = nanoid(10)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
  const signerEmail = `signer-${suffix}@example.com`;
  const ccEmail = `cc-${suffix}@example.com`;

  const envelope = await seedDraftDocument(owner, team.id, [signerEmail], {
    key: `cc-journey-${suffix}`,
  });

  // seedDraftDocument only gives the signer a NAME field, but sendDocument
  // rejects signers without at least one signature field.
  const seededSigner = await prisma.recipient.findFirstOrThrow({
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
      recipientId: seededSigner.id,
    },
  });

  // seedDraftDocument only creates signers, so add the CC recipient directly.
  await prisma.recipient.create({
    data: {
      email: ccEmail,
      name: 'CC Recipient',
      token: nanoid(),
      role: RecipientRole.CC,
      readStatus: ReadStatus.NOT_OPENED,
      sendStatus: SendStatus.NOT_SENT,
      signingStatus: SigningStatus.NOT_SIGNED,
      envelopeId: envelope.id,
    },
  });

  // ---------------------------------------------------------------- send ---
  await sendDocument({
    id: { type: 'envelopeId', id: envelope.id },
    userId: owner.id,
    teamId: team.id,
    sendEmail: true,
    requestMetadata: {
      auth: null,
      requestMetadata: {},
      source: 'app',
    },
  });

  const signerInbox = await waitForMail(signerEmail);
  const ccInbox = await waitForMail(ccEmail);

  console.log('SENT/signer subject:', signerInbox[0].subject);
  console.log('SENT/cc subject:', ccInbox[0].subject);

  expect(signerInbox.length, 'signer should receive the signing request').toBeGreaterThanOrEqual(1);
  expect(ccInbox.length, 'CC should receive the sent-for-signing email').toBeGreaterThanOrEqual(1);

  const ccBody = await readMessage(ccEmail, ccInbox[0].id);
  const ccHtml: string = ccBody.body?.html ?? '';

  // Fork rule: only two text colours may appear in email bodies.
  const disallowedColours = ccHtml.match(/#(?:ef4444|dc2626|f59e0b|eab308|3b82f6|2563eb)/gi) ?? [];
  console.log('CC email disallowed colours:', JSON.stringify(disallowedColours));

  // ------------------------------------------------------------- signing ---
  const signer = await prisma.recipient.findFirstOrThrow({
    where: { envelopeId: envelope.id, email: signerEmail },
  });

  await page.goto(`/sign/${signer.token}`);
  await page.waitForURL(`/sign/${signer.token}`);

  const signingPageText = (await page.locator('body').innerText()).slice(0, 4000);
  console.log('--- SIGNING PAGE TEXT ---');
  console.log(signingPageText);

  // Fork rule: recipient-facing pages must not use lucide status glyphs.
  const statusIcons = await page
    .locator('svg.lucide-circle-check, svg.lucide-circle-x, svg.lucide-circle-alert, svg.lucide-clock')
    .count();
  console.log('SIGNING PAGE status icons found:', statusIcons);

  expect(statusIcons, 'no lucide status icons on the signing page').toBe(0);

  // Sign the pad first, then insert each field (the pad is opened from the
  // sidebar, not by clicking a field).
  await signSignaturePad(page);

  const signerFields = await prisma.field.findMany({
    where: { recipientId: signer.id },
    orderBy: { id: 'asc' },
  });

  for (const field of signerFields) {
    await page.locator(`#field-${field.id}`).getByRole('button').click();
    await expect(page.locator(`#field-${field.id}`)).toHaveAttribute('data-inserted', 'true');
  }

  await page.getByRole('button', { name: 'Complete' }).click();
  await page.getByRole('button', { name: 'Sign' }).click();

  await page.waitForURL(`/sign/${signer.token}/complete`, { timeout: 30_000 });

  const completePageText = (await page.locator('body').innerText()).slice(0, 3000);
  console.log('--- COMPLETION PAGE TEXT ---');
  console.log(completePageText);

  const completeIcons = await page
    .locator('svg.lucide-circle-check, svg.lucide-circle-x, svg.lucide-circle-alert, svg.lucide-clock')
    .count();
  console.log('COMPLETION PAGE status icons found:', completeIcons);
  expect(completeIcons, 'no lucide status icons on the completion page').toBe(0);

  // ---------------------------------------------------- completion emails ---
  const ownerFinal = await waitForMail(owner.email, 1, 60_000);
  const signerFinal = await waitForMail(signerEmail, 2, 60_000);
  const ccFinal = await waitForMail(ccEmail, 2, 60_000);

  console.log('FINAL/owner subjects:', JSON.stringify(ownerFinal.map((m) => m.subject)));
  console.log('FINAL/signer subjects:', JSON.stringify(signerFinal.map((m) => m.subject)));
  console.log('FINAL/cc subjects:', JSON.stringify(ccFinal.map((m) => m.subject)));

  expect(ccFinal.length, 'CC should receive the completion email too').toBeGreaterThanOrEqual(2);
});

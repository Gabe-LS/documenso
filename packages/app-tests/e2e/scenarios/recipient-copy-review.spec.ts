import { prisma } from '@documenso/prisma';
import {
  seedCancelledDocument,
  seedCompletedDocument,
  seedPendingDocumentWithFullFields,
} from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { test } from '@playwright/test';
import { DocumentStatus, RecipientRole, SigningStatus } from '@prisma/client';
import { DateTime } from 'luxon';
import { nanoid } from 'nanoid';

/**
 * Walks every recipient-facing page in Italian and dumps the rendered copy so
 * it can be reviewed for correctness and consistency. Assertion-free by
 * design — this is a capture harness, not a pass/fail gate.
 */
test.use({ locale: 'it-IT' });

const dump = async (page: import('@playwright/test').Page, label: string, url: string) => {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1_200);

  const text = (await page.locator('body').innerText()).replace(/\n{3,}/g, '\n\n').trim();

  console.log(`\n===== ${label} =====`);
  console.log(`URL: ${url}`);
  console.log(text.slice(0, 2_500));

  // Any lucide status glyph is a fork-rule violation on recipient pages.
  const icons = await page
    .locator(
      'svg.lucide-circle-check, svg.lucide-circle-x, svg.lucide-circle-alert, svg.lucide-clock, svg.lucide-check-circle, svg.lucide-x-circle',
    )
    .count();
  console.log(`[icons] ${label}: ${icons}`);
};

test('[REVIEW] recipient-facing pages in Italian', async ({ page }) => {
  test.setTimeout(300_000);

  const { user: owner, team } = await seedUser({ name: 'Studio Legale Rossi' });
  const suffix = nanoid(8)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  // ---------------------------------------------------------- PENDING ---
  const pending = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: [`sign-${suffix}@example.com`],
  });

  await dump(page, 'PENDING / signing page', `/sign/${pending.recipients[0].token}`);

  // ---------------------------------------------------------- WAITING ---
  const waiting = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: [`wait-a-${suffix}@example.com`, `wait-b-${suffix}@example.com`],
  });

  await prisma.recipient.update({
    where: { id: waiting.recipients[0].id },
    data: { signingStatus: SigningStatus.SIGNED, signedAt: new Date() },
  });

  await dump(page, 'WAITING', `/sign/${waiting.recipients[1].token}/waiting`);

  // -------------------------------------------------------- COMPLETED ---
  const completed = await seedCompletedDocument(owner, team.id, [`done-${suffix}@example.com`]);
  const completedRecipient = await prisma.recipient.findFirstOrThrow({
    where: { envelopeId: completed.id },
  });

  await dump(page, 'COMPLETED', `/sign/${completedRecipient.token}/complete`);

  // -------------------------------------------------------- CANCELLED ---
  const cancelled = await seedCancelledDocument(owner, team.id, [`canc-${suffix}@example.com`]);
  const cancelledRecipient = await prisma.recipient.findFirstOrThrow({
    where: { envelopeId: cancelled.id },
  });

  await dump(page, 'CANCELLED', `/sign/${cancelledRecipient.token}`);

  // --------------------------------------------------------- REJECTED ---
  const rejected = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: [`rej-${suffix}@example.com`],
  });

  await prisma.recipient.update({
    where: { id: rejected.recipients[0].id },
    data: {
      signingStatus: SigningStatus.REJECTED,
      rejectionReason: 'Condizioni non concordate',
    },
  });

  await dump(page, 'REJECTED', `/sign/${rejected.recipients[0].token}/rejected`);

  // ---------------------------------------------------------- EXPIRED ---
  const expired = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: [`exp-${suffix}@example.com`],
  });

  await prisma.recipient.update({
    where: { id: expired.recipients[0].id },
    data: { expired: DateTime.utc().minus({ days: 2 }).toJSDate() },
  });

  await dump(page, 'EXPIRED', `/sign/${expired.recipients[0].token}/expired`);

  // ------------------------------------------------------- CC / VIEWER ---
  const ccDoc = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: [`ccview-${suffix}@example.com`],
    recipientsCreateOptions: [{ role: RecipientRole.VIEWER }],
  });

  await dump(page, 'VIEWER', `/sign/${ccDoc.recipients[0].token}`);

  console.log('\n===== STATUS SUMMARY =====');
  console.log(
    JSON.stringify(
      {
        pending: pending.document.status,
        completed: completed.status,
        cancelled: cancelled.status,
      },
      null,
      2,
    ),
  );
  console.log(DocumentStatus.PENDING);
});

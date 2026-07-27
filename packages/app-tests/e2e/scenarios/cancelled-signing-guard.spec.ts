import { prisma } from '@documenso/prisma';
import { seedPendingDocumentWithFullFields } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { expect, test } from '@playwright/test';
import { DocumentStatus, FieldType } from '@prisma/client';

import { signSignaturePad } from '../fixtures/signature';

/**
 * The signing route renders "This document has been cancelled by the owner"
 * only for `deletedAt` / REJECTED — never for CANCELLED. This checks whether a
 * recipient can go further than merely seeing the wrong page.
 */
test('[GUARD] a cancelled document must not be signable', async ({ page }) => {
  test.setTimeout(180_000);

  const { user: owner, team } = await seedUser();

  const { recipients } = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: ['guard-target@example.com'],
    fields: [FieldType.SIGNATURE],
  });

  const recipient = recipients[0];

  // Cancel the document the way the owner would leave it.
  await prisma.envelope.update({
    where: { id: (await prisma.recipient.findFirstOrThrow({ where: { id: recipient.id } })).envelopeId },
    data: { status: DocumentStatus.CANCELLED },
  });

  await page.goto(`/sign/${recipient.token}`);
  await page.waitForTimeout(1_500);

  const body = await page.locator('body').innerText();
  console.log('--- CANCELLED DOC PAGE ---');
  console.log(body.slice(0, 900));

  const showsCancelledNotice = /cancell|annullat/i.test(body);
  console.log('shows a cancelled notice:', showsCancelledNotice);

  // Try to actually sign it.
  let completed = false;
  try {
    await signSignaturePad(page);

    for (const field of recipient.fields) {
      await page.locator(`#field-${field.id}`).getByRole('button').click({ timeout: 10_000 });
    }

    await page.getByRole('button', { name: 'Complete' }).click({ timeout: 10_000 });
    await page.getByRole('button', { name: 'Sign' }).click({ timeout: 10_000 });
    await page.waitForURL(`/sign/${recipient.token}/complete`, { timeout: 20_000 });
    completed = true;
  } catch (error) {
    console.log('signing blocked at:', (error as Error).message.split('\n')[0]);
  }

  const after = await prisma.recipient.findFirstOrThrow({ where: { id: recipient.id } });
  const envelope = await prisma.envelope.findFirstOrThrow({ where: { id: after.envelopeId } });

  console.log('reached /complete:', completed);
  console.log('recipient.signingStatus:', after.signingStatus);
  console.log('envelope.status:', envelope.status);

  expect(envelope.status, 'a cancelled document must stay cancelled').toBe(DocumentStatus.CANCELLED);
});

import { prisma } from '@documenso/prisma';
import { seedPendingDocumentWithFullFields } from '@documenso/prisma/seed/documents';
import { seedUser } from '@documenso/prisma/seed/users';
import { test } from '@playwright/test';

/**
 * Proves the "X on behalf of X" duplication is not an artifact of the seed's
 * user and team sharing the name "Personal Team".
 */
test('[COPY] sender line with a distinct team name', async ({ page }) => {
  test.setTimeout(120_000);

  const { user: owner, team } = await seedUser({ name: 'Mario Bianchi' });

  await prisma.team.update({
    where: { id: team.id },
    data: { name: 'Studio Notarile Verdi' },
  });

  const { recipients } = await seedPendingDocumentWithFullFields({
    owner,
    teamId: team.id,
    recipients: ['dup-check@example.com'],
  });

  await page.goto(`/sign/${recipients[0].token}`);
  await page.waitForTimeout(1_500);

  const body = await page.locator('body').innerText();
  const line = body.split('\n').find((l) => /invited you to|per conto di|ha invitato/i.test(l));

  console.log('owner user name : Mario Bianchi');
  console.log('team name       : Studio Notarile Verdi');
  console.log('rendered line   :', line);
});

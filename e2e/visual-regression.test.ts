import { expect, test } from '@playwright/test';

test('/', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ fullPage: true, scale: 'device' });
});

test('/singing-streams', async ({ page }) => {
  await page.goto('/singing-streams');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ scale: 'device' });
});

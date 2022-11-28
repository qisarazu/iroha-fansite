import { expect, test } from '@playwright/test';

test('/', async ({ page }) => {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot({ fullPage: true, scale: 'device' });
});

test('/singing-streams', async ({ page }) => {
  await page.goto('/singing-streams');
  await page.waitForLoadState('networkidle');

  // Wait for all images to be loaded.
  const promises = await page
    .locator('img')
    .evaluateAll((imgElms: HTMLImageElement[]) =>
      imgElms.map((img) => img.complete || new Promise((resolve) => (img.onload = resolve))),
    );
  await Promise.all(promises);

  await expect(page).toHaveScreenshot({ scale: 'device' });
});

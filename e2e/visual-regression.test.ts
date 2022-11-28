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

test('/singing-streams/watch', async ({ page, baseURL }) => {
  // Navigate from /singing-streams to the page to be tested.
  await page.goto('/singing-streams');
  await page.getByPlaceholder('曲名').fill('king');
  await Promise.all([
    page.waitForResponse(`${baseURL}/api/singing-streams?keyword=king`),
    page.getByRole('button', { name: '検索' }).click(),
  ]);
  await page
    .getByRole('link', { name: /KING \/?Kanaria 【歌枠】歌初め✨週1歌枠でござる🎤【風真いろは\/ホロライブ】/ })
    .click();
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot({ scale: 'device' });
});

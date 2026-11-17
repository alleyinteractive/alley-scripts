import { expect, test } from '@alleyinteractive/playwright-config';

// A generic smoke test that works on any site. Add your own flows below, e.g.
// clicking through the main navigation or submitting a search.
test('homepage loads', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(page).toHaveTitle(/.+/);
});

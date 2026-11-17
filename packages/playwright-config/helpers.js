import { expect, test } from '@playwright/test';

/**
 * Wait until a page is visually stable: fonts loaded, lazy content triggered,
 * and images decoded. Call after `page.goto()` and before taking a screenshot.
 *
 * Every wait is bounded, so one stuck resource (an image that never loads, a
 * page that keeps growing) delays the screenshot instead of hanging the test.
 *
 * @param {import('@playwright/test').Page} page
 * @param {{ timeout?: number, scroll?: boolean, settleTimeout?: number }} [options]
 *   `timeout` bounds the load event; `settleTimeout` bounds each of the scroll
 *   and image waits.
 */
export async function waitForPageReady(
  page,
  { timeout = 15_000, scroll = true, settleTimeout = 5_000 } = {},
) {
  await page.waitForLoadState('load', { timeout });

  // Network may never go fully idle (analytics, polling); don't fail on it.
  await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});

  if (scroll) {
    // Scroll to the bottom in steps to trigger lazy loading, then reset. Stop
    // at the deadline in case the page keeps growing (infinite scroll).
    await page.evaluate(async (maxMs) => {
      const deadline = Date.now() + maxMs;
      const step = Math.max(window.innerHeight, 400);
      for (let y = 0; y < document.body.scrollHeight && Date.now() < deadline; y += step) {
        window.scrollTo(0, y);
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => { setTimeout(resolve, 100); });
      }
      window.scrollTo(0, 0);
    }, settleTimeout);
  }

  await page.evaluate(async (maxMs) => {
    const images = Array.from(document.images).map((img) => {
      // Lazy images that are off screen never load on their own, so a wait for
      // them would hang. Make them eager so they actually start loading.
      img.loading = 'eager';

      return img.complete
        ? Promise.resolve()
        : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        });
    });

    await Promise.race([
      Promise.all([document.fonts.ready, ...images]),
      new Promise((resolve) => { setTimeout(resolve, maxMs); }),
    ]);
  }, settleTimeout);
}

/** Turn `/about/team/?x=1` into `about-team-x-1`; `/` becomes `home`. */
export function slugify(value) {
  const slug = value
    .replace(/^https?:\/\/[^/]+/, '')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  return slug || 'home';
}

/**
 * Register one screenshot test per URL. Viewports come from the Playwright
 * projects created by `createConfig()`, so each URL is captured at every
 * configured viewport.
 *
 * Each entry is a path/URL string or an object:
 *   { path, name?, fullPage?, mask?: string[], waitFor?: (page) => Promise }
 *
 * @param {Array<string|object>} urls
 * @param {{ fullPage?: boolean }} [defaults]
 */
export function screenshotUrls(urls, defaults = {}) {
  urls.forEach((entry) => {
    const item = typeof entry === 'string' ? { path: entry } : entry;
    const name = item.name ?? slugify(item.path);

    test(`screenshot: ${name}`, async ({ page }, testInfo) => {
      await page.goto(item.path);
      await waitForPageReady(page);

      if (item.waitFor) {
        await item.waitFor(page);
      }

      await expect(page).toHaveScreenshot(`${name}.png`, {
        fullPage: item.fullPage ?? defaults.fullPage ?? true,
        mask: (item.mask ?? []).map((selector) => page.locator(selector)),
      });

      // Passing tests have no images in the HTML report, so attach the
      // baseline to make it viewable there. (Failures already show a diff.)
      await testInfo.attach(`${name}.png`, {
        path: testInfo.snapshotPath(`${name}.png`),
        contentType: 'image/png',
      });
    });
  });
}

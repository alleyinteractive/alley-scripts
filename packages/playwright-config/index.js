import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

export { expect, test } from '@playwright/test';
export { screenshotUrls, slugify, waitForPageReady } from './helpers.js';

const style = (file) => fileURLToPath(new URL(`./styles/${file}`, import.meta.url));

export const defaultViewports = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1440, height: 900 },
};

/**
 * Build a Playwright config.
 *
 * Environment variables:
 *   PW_BASE_URL               Overrides `baseURL` (e.g. local vs. preprod).
 *   PLAYWRIGHT_HTTP_USER/PASS Basic auth credentials.
 *   CI                        Selects committed (CI) vs. gitignored (local) baselines.
 *
 * @param {object} options
 * @param {string} [options.baseURL]
 * @param {Array<string|object>} [options.urls] Pages to screenshot; exposed as `config.metadata.urls`.
 * @param {Record<string, {width: number, height: number}>} [options.viewports]
 * @param {boolean} [options.wordpress] Also hide WordPress chrome (admin bar, etc.).
 * @param {number} [options.maxDiffPixelRatio]
 * @param {string[]} [options.stylePath] Extra stylesheets to inject while screenshotting.
 * @param {object} [options.overrides] Deep-ish merged over the defaults (shallow per top-level key).
 */
export function createConfig({
  baseURL,
  urls = [],
  viewports = defaultViewports,
  wordpress = false,
  maxDiffPixelRatio = 0.01,
  stylePath = [],
  testDir = './tests',
  ...overrides
} = {}) {
  const isCI = Boolean(process.env.CI);
  const { PLAYWRIGHT_HTTP_USER: username, PLAYWRIGHT_HTTP_PASS: password } = process.env;
  const { use = {}, expect: expectOverrides = {}, ...rest } = overrides;

  return defineConfig({
    testDir,
    // Full-page screenshots wait for fonts, lazy images, and network settling.
    timeout: 60_000,
    snapshotDir: `${testDir}/__screenshots__`,
    // CI baselines are committed; local baselines live under `local/` and are gitignored.
    snapshotPathTemplate: `{snapshotDir}/${isCI ? 'ci' : 'local'}/{testFilePath}/{projectName}-{arg}{ext}`,
    fullyParallel: true,
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    reporter: [['list'], ['html', { open: 'never' }]],
    metadata: { urls },
    expect: {
      ...expectOverrides,
      toHaveScreenshot: {
        maxDiffPixelRatio,
        animations: 'disabled',
        caret: 'hide',
        stylePath: [
          style('hide-dynamic.css'),
          ...(wordpress ? [style('wordpress.css')] : []),
          ...stylePath,
        ],
        ...expectOverrides.toHaveScreenshot,
      },
    },
    use: {
      baseURL: process.env.PW_BASE_URL || baseURL,
      ...(username ? { httpCredentials: { username, password: password ?? '' } } : {}),
      trace: 'retain-on-failure',
      ...use,
    },
    projects: Object.entries(viewports).map(([name, viewport]) => ({
      name,
      use: { browserName: 'chromium', viewport },
    })),
    ...rest,
  });
}

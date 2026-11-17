# @alleyinteractive/playwright-config

Free screenshot and functional testing with [Playwright](https://playwright.dev).
A project supplies URLs and flows; this package supplies the config, helpers,
and CI workflows. It works for any site. WordPress-specific tweaks are opt-in.

Playwright is pinned in this package (`@playwright/test`), so upgrading is a
single change here. Because a Playwright bump can alter rendering and
invalidate every baseline, such bumps ship as major versions.

## Per-project setup

```sh
npm i -D @alleyinteractive/playwright-config
npx alley-playwright init
```

`init` asks for the site URL to test, then offers to install the Chromium
browser (if you decline, run `npx alley-playwright install chromium` yourself).
To skip the URL prompt, pass `--base-url https://preprod.example.com`; without
a terminal (e.g. in CI) it uses a placeholder you can edit later. The generated
config screenshots only `/`, so it works as-is; add more pages later in the
`urls` list of `playwright.config.js`.

`init` also offers (default: no) to append a short Playwright section to your
project's `CLAUDE.md` (or `AGENTS.md`, if that is the file you have) so AI
agents know the entry command, how to re-record baselines, and where to find
this README. Agents don't read package READMEs on their own, but they do read
these files. Pass
`--agent-docs` to opt in without the prompt, or `--no-agent-docs` to skip it.
The section is only added once, and the text is in
[`examples/agent-docs.md`](./examples/agent-docs.md).

`init` creates `playwright.config.js`, example specs in `tests/`, the caller
workflows in `.github/workflows/`, and the `.gitignore` entries below. It skips
files that already exist (pass `--force` to overwrite). The rest of this
section describes what it creates, in case you'd rather set it up by hand.

1. `playwright.config.js` (see [`examples/`](./examples)):

   ```js
   import { createConfig } from '@alleyinteractive/playwright-config';

   export default createConfig({
     baseURL: 'https://preprod.example.com',
     wordpress: true, // optional: hide admin bar and similar chrome
     urls: ['/', '/about/', { path: '/news/', name: 'news', mask: ['.ticker'] }],
   });
   ```

2. `tests/` with a screenshot spec and any functional specs (see
   [`examples/tests`](./examples/tests)). Import `test` and `expect` from this
   package so the Playwright version is always the pinned one.
3. `.gitignore`:

   ```gitignore
   tests/__screenshots__/local/
   playwright-report/
   test-results/
   ```

4. A caller workflow (see [`examples/workflows`](./examples/workflows)).

## What `createConfig()` sets

- One Playwright project per viewport (default: mobile 375x812, tablet
  768x1024, desktop 1440x900, all Chromium). Override with `viewports`.
- `toHaveScreenshot` defaults: `maxDiffPixelRatio: 0.01`, animations disabled,
  caret hidden, and a stylesheet hiding ads, cookie banners, and embeds.
  Add `data-pw-hide` to any element to hide it too.
- Baseline paths switch on `process.env.CI`:
  - CI: `tests/__screenshots__/ci/...`, **committed**.
  - Local: `tests/__screenshots__/local/...`, **gitignored**.
- `PW_BASE_URL` overrides `baseURL`.
- `PLAYWRIGHT_HTTP_USER` / `PLAYWRIGHT_HTTP_PASS` enable basic auth.
- Any other Playwright option passes through (`use`, `expect`, `retries`, ...).

## Helpers

- `screenshotUrls(urls)`: registers one screenshot test per URL, at every
  configured viewport, and attaches each baseline to the HTML report. Entries
  are a path or `{ path, name, fullPage, mask, waitFor }`.
- `waitForPageReady(page)`: waits for load, fonts, lazy-loaded content (by
  scrolling), and images.

## Running

`npx alley-playwright <args>` passes through to the pinned Playwright CLI.

### Locally (production baseline vs. feature branch)

Local baselines come from macOS/your machine, so they are never committed and
never compared with CI baselines.

```sh
# 1. On the production branch, rebuild assets, then record baselines
git checkout main && npm run build
npx alley-playwright test --update-snapshots=all

# 2. On the feature branch, rebuild assets, then compare
git checkout my-feature && npm run build
npx alley-playwright test
```

The site URL comes from `baseURL` in `playwright.config.js`. Set `PW_BASE_URL`
to override it for a single run (e.g.
`PW_BASE_URL=https://preprod.example.com npx alley-playwright test`).

If you declined the browser install during `init`, run
`npx alley-playwright install chromium` once before the first test.

### Setting a new baseline

Re-record the baselines whenever you want the current state of the site to be
the "known good" one:

```sh
npx alley-playwright test --update-snapshots=all
```

This overwrites every local baseline and the tests pass, because they are
recording rather than comparing. Use `=all`: plain `--update-snapshots` only
updates screenshots that currently fail.

- One viewport: `... --update-snapshots=all --project=desktop`
- One page: `... --update-snapshots=all -g "home"`
- Start clean (also drops screenshots for pages removed from `urls`):

  ```sh
  rm -rf tests/__screenshots__/local
  npx alley-playwright test --update-snapshots=all
  ```

Local baselines are gitignored, so there is nothing to commit.

### Viewing baselines

Baselines are plain PNGs at
`tests/__screenshots__/local/<spec file>/<viewport>-<name>.png` (for example
`tests/__screenshots__/local/screenshots.spec.js/mobile-home.png`). Open the
folder with `open tests/__screenshots__/local` on macOS.

They also appear in the HTML report. Each screenshot test attaches its
baseline, and failed tests additionally show the expected, actual, and diff
images:

```sh
npx alley-playwright show-report
```

The report shows images at their natural size, so narrower viewports (mobile,
tablet) leave empty space to the right of the image. If a PNG itself is wider
than its viewport (mobile 375px, tablet 768px, desktop 1440px by default), the
page overflows horizontally, and the full-page capture includes that blank area.

### Setting up CI

These steps run the tests against a preprod site on a schedule and on demand.
Do them in the project repo.

1. **Run `init`** (see [Per-project setup](#per-project-setup)) with the preprod
   URL. This creates the caller workflows in `.github/workflows/`:

   ```sh
   npx alley-playwright init --base-url https://preprod.example.com
   ```

2. **Check the caller workflows** (`playwright.yml` and
   `playwright-update-baselines.yml`):
   - `base-url` is the preprod URL.
   - `ref` is the branch to test and to commit baselines to. It defaults to
     `preprod`, so that branch must exist, or set `ref:`.
   - If `package.json` is in a subfolder, add `working-directory: <subfolder>`.
   - Change the `cron` schedule if nightly is not what you want.

3. **Commit `package-lock.json`.** The workflows use `npm ci`, so the lockfile
   must be committed and in sync with `package.json`.

4. **Add secrets** under Settings → Secrets and variables → Actions. All are
   optional, and the callers pass them through with `secrets: inherit`:
   - `PLAYWRIGHT_HTTP_USER` and `PLAYWRIGHT_HTTP_PASS`, if preprod is behind
     basic auth.
   - `SLACK_WEBHOOK_URL`, to get a message when the tests fail.

5. **Allow the baseline commit.** The baseline workflow pushes to `ref` as
   `github-actions[bot]`:
   - If the branch is protected, add a bypass for `github-actions[bot]`.
   - Under Settings → Actions → General → Workflow permissions, make sure
     workflows are not forced to read-only.

6. **Merge to the default branch.** Scheduled runs, and the "Run workflow"
   button for `workflow_dispatch`, only work from the default branch's copy of
   the caller file. The branch in `ref` (`preprod`) also needs the config,
   `tests/`, and lockfile, because that is what the workflow checks out.

7. **Record the first baselines.** Go to Actions → "Update Playwright
   baselines" → Run workflow. It runs on the Linux runner and commits
   `tests/__screenshots__/ci/` to `ref`. Open the committed PNGs to confirm
   they look right. Never commit baselines made on a laptop to `ci/`; they
   render differently and will fail every run.

8. **Run the tests.** Go to Actions → "Playwright tests" → Run workflow. It
   should pass against the new baselines, and then runs on the schedule.

9. **When a run fails**, open it and download the artifacts:
   - `playwright-report` (always uploaded): extract it and run
     `npx alley-playwright show-report <folder>`.
   - `playwright-test-results` (failures only): the expected, actual, and diff
     images.

   If the change is intended, re-run "Update Playwright baselines" (with
   `update-mode: all` to rewrite everything). If it is a regression, fix the
   site.

Re-record baselines after upgrading this package, since a Playwright bump can
change rendering.

#### Different setups for local and CI

`PW_BASE_URL` overrides `baseURL`, and the workflows set it from `base-url`, so
CI and local runs can use different hosts. `createConfig` is plain JavaScript,
so you can also choose the base URL and the page list from `process.env.CI`
(set to `true` in the workflows, unset locally):

```js
const shared = ['/', '/about/'];

export default createConfig({
  baseURL: process.env.CI ? 'https://preprod.example.com' : 'http://mysite.test',
  urls: [...shared, ...(process.env.CI ? ['/news/'] : ['/sandbox/'])],
});
```

Local and CI baselines are stored separately (`local/` and `ci/`), so they are
never compared with each other. Keep the CI page list stable: baselines are
keyed by page name and viewport.

#### Optional: run after every preprod deploy

The callers only run on a schedule and on demand. To also run after a push to
`preprod`, add `push: branches: [preprod]` to the `on:` block of
`playwright.yml`. Run it after the deploy finishes, or the tests may hit the
old build. The baseline workflow's own commit won't retrigger it, because
pushes made with the default `GITHUB_TOKEN` don't start new workflow runs.

### Reusable workflows

The reusable workflows live in this repo under `.github/workflows/`:

| Workflow | Purpose |
| --- | --- |
| `playwright.yml` | Checks out `preprod`, runs tests against `base-url`, uploads the HTML report and diffs, optionally notifies Slack. |
| `playwright-update-baselines.yml` | Regenerates baselines on the Linux runner and commits them to `preprod`. |

Callers trigger them via `schedule` and `workflow_dispatch`. Scheduled
workflows only run from the default branch's copy of the caller file.

Inputs (both workflows): `base-url` (required), `ref` (default `preprod`),
`working-directory` (default `.`, for projects where `package.json` is in a
subfolder), `node-version`. The test workflow also takes `playwright-args`;
the baseline workflow takes `snapshot-path` and `update-mode`
(`changed` by default; use `all` to rewrite everything).

Secrets (all optional, pass with `secrets: inherit` or explicitly):

- `SLACK_WEBHOOK_URL`: notified on failure.
- `PLAYWRIGHT_HTTP_USER`, `PLAYWRIGHT_HTTP_PASS`: basic auth for protected
  environments.

Pin callers to a release tag instead of `@main` once tags exist. If `preprod`
is branch-protected, the baseline workflow's push needs a bypass for
`github-actions[bot]`.

## Notes

- Baselines must be generated on the Linux runner for CI; never commit
  baselines made on a laptop to the `ci/` directory.
- Keep the project's `package-lock.json` committed; the workflows use `npm ci`.

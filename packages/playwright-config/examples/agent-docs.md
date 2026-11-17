## Playwright screenshot tests

Before running or changing the screenshot and functional tests, read
`node_modules/@alleyinteractive/playwright-config/README.md` (commands,
baselines, masking).

- Run Playwright through `npx alley-playwright <args>`, which pins the version.
- Re-record baselines with `npx alley-playwright test --update-snapshots=all`,
  which replaces every baseline. Record on `main`, then compare on the feature
  branch.
- Local baselines (`tests/__screenshots__/local/`) are gitignored and stay on
  the machine; the CI baselines (`tests/__screenshots__/ci/`) are the committed
  ones.
- Add pages to the `urls` list in `playwright.config.js`; steady a flaky
  element with a `data-pw-hide` attribute or a `mask` selector.
- Import `test` and `expect` from `@alleyinteractive/playwright-config`.

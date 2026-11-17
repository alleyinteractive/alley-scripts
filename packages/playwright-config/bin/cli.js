#!/usr/bin/env node
/**
 * Thin pass-through to the Playwright CLI bundled with this package, so every
 * project runs the same pinned Playwright version.
 *
 *   npx alley-playwright init                 (prompts for the site URL)
 *   npx alley-playwright init --base-url https://project.test
 *   npx alley-playwright init --agent-docs      (add notes to CLAUDE.md; --no-agent-docs skips)
 *   npx alley-playwright test
 *   npx alley-playwright test --update-snapshots=all
 *   npx alley-playwright install --with-deps chromium
 *
 * `init` is the only command handled here; everything else goes to Playwright.
 */
import { spawnSync } from 'node:child_process';
import {
  existsSync, mkdirSync, readFileSync, writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const examples = join(dirname(fileURLToPath(import.meta.url)), '..', 'examples');

const playwright = (args) => spawnSync(
  process.execPath,
  [require.resolve('@playwright/test/cli'), ...args],
  { stdio: 'inherit' },
);

/** Ask a question in the terminal. Returns null without one (CI, pipes). */
async function ask(question) {
  if (!process.stdin.isTTY) {
    return null;
  }

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();

  return answer.trim();
}

const AGENT_DOCS_HEADING = '## Playwright screenshot testing';

const PLACEHOLDER_URL = 'https://preprod.example.com';
const GITIGNORE_ENTRIES = [
  'tests/__screenshots__/local/',
  'playwright-report/',
  'test-results/',
];

/** Example file => destination, relative to the project root. */
const FILES = {
  'playwright.config.js': 'playwright.config.js',
  'tests/screenshots.spec.js': 'tests/screenshots.spec.js',
  'tests/functional.spec.js': 'tests/functional.spec.js',
  'workflows/playwright.yml': '.github/workflows/playwright.yml',
  'workflows/playwright-update-baselines.yml': '.github/workflows/playwright-update-baselines.yml',
};

/**
 * Ask for the site URL. Without a terminal there is nobody to ask, so fall
 * back to the placeholder.
 *
 * @return {Promise<string>} The URL entered, or the placeholder.
 */
async function promptForBaseUrl() {
  const answer = await ask('Site URL to test (e.g. http://project.test): ');

  return answer || PLACEHOLDER_URL;
}

/**
 * Offer to download the Chromium browser. Without a terminal, don't ask.
 *
 * @return {Promise<boolean>} Whether to install now.
 */
async function confirmInstall() {
  const answer = await ask('\nInstall the Chromium browser now? [Y/n] ');

  return answer !== null && !/^n/i.test(answer);
}

/**
 * Decide whether to add Playwright notes for AI agents. Opt-in: only a flag or
 * an explicit "y" at the prompt turns it on.
 *
 * @param {string[]} args CLI args after `init`.
 * @return {Promise<boolean>}
 */
async function wantsAgentDocs(args) {
  if (args.includes('--agent-docs')) {
    return true;
  }

  if (args.includes('--no-agent-docs')) {
    return false;
  }

  const answer = await ask(
    '\nAdd Playwright notes to CLAUDE.md so AI agents know the commands? [y/N] ',
  );

  return /^y/i.test(answer ?? '');
}

/** Append the agent notes to CLAUDE.md (or AGENTS.md if that is what exists). */
function addAgentDocs() {
  const target = ['CLAUDE.md', 'AGENTS.md'].find((file) => existsSync(file)) ?? 'CLAUDE.md';
  const current = existsSync(target) ? readFileSync(target, 'utf8') : '';

  if (current.includes(AGENT_DOCS_HEADING)) {
    console.log(`skipped  ${target} (already has Playwright notes)`);
    return;
  }

  const separator = current ? `${current.endsWith('\n') ? '' : '\n'}\n` : '';
  writeFileSync(target, `${current}${separator}${readFileSync(join(examples, 'agent-docs.md'), 'utf8')}`);
  console.log(`${current ? 'updated ' : 'created '} ${target}`);
}

/**
 * Copy the example files into the current project.
 *
 * @param {string[]} args CLI args after `init`.
 */
async function init(args) {
  const force = args.includes('--force');
  const flagIndex = args.indexOf('--base-url');
  let baseUrl;

  if (flagIndex === -1) {
    baseUrl = await promptForBaseUrl();
  } else {
    baseUrl = args[flagIndex + 1];

    if (!baseUrl || baseUrl.startsWith('--')) {
      console.error('--base-url needs a value, e.g. --base-url https://project.test');
      process.exit(1);
    }
  }

  Object.entries(FILES).forEach(([from, to]) => {
    if (existsSync(to) && !force) {
      console.log(`skipped  ${to} (already exists; use --force to overwrite)`);
      return;
    }

    mkdirSync(dirname(to), { recursive: true });
    writeFileSync(
      to,
      readFileSync(join(examples, from), 'utf8').replaceAll(PLACEHOLDER_URL, baseUrl),
    );
    console.log(`created  ${to}`);
  });

  const current = existsSync('.gitignore') ? readFileSync('.gitignore', 'utf8') : '';
  const missing = GITIGNORE_ENTRIES.filter(
    (entry) => !current.split('\n').some((line) => line.trim() === entry),
  );

  if (missing.length) {
    const prefix = current && !current.endsWith('\n') ? '\n' : '';
    writeFileSync('.gitignore', `${current}${prefix}${missing.join('\n')}\n`);
    console.log(`updated  .gitignore (+${missing.length})`);
  }

  if (await wantsAgentDocs(args)) {
    addAgentDocs();
  }

  console.log('\nAdd more pages later in the urls list of playwright.config.js.');

  if (await confirmInstall()) {
    const { status } = playwright(['install', 'chromium']);

    if (status !== 0) {
      console.error('\nBrowser install failed. Retry with: npx alley-playwright install chromium');
      process.exit(status ?? 1);
    }

    console.log('\nNext: npx alley-playwright test --update-snapshots=all');
    return;
  }

  console.log('\nNext: npx alley-playwright install chromium');
  console.log('Then: npx alley-playwright test --update-snapshots=all');
}

const [command, ...rest] = process.argv.slice(2);

if (command === 'init') {
  await init(rest);
  process.exit(0);
}

const { status, error } = playwright(command ? [command, ...rest] : []);

if (error) {
  console.error(error);
}

process.exit(status ?? 1);

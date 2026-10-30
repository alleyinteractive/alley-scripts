import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import feature from './index.js';

const fixture = async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'convert-to-pest-'));

  await fs.mkdir(path.join(root, 'tests'));
  await fs.writeFile(path.join(root, 'composer.json'), JSON.stringify({
    require: { php: '^8.2' },
    'require-dev': { 'mantle-framework/testkit': '^1.15' },
    scripts: { phpunit: 'phpunit' },
  }));
  await fs.writeFile(path.join(root, 'plugin.php'), '<?php\n/**\n * Plugin Name: Example\n * Requires PHP: 8.2\n */\n');

  return root;
};

const context = (root, overrides = {}) => {
  const messages = [];

  return {
    messages,
    cwd: root,
    dryRun: false,
    inputs: { confirm: true },
    logger: { info: (message) => messages.push(message), warn: (message) => messages.push(message) },
    ...overrides,
  };
};

describe('convert-plugin-to-pest', () => {
  it('does not modify files during a dry run', async () => {
    const root = await fixture();
    const before = await fs.readFile(path.join(root, 'composer.json'), 'utf8');
    const ctx = context(root, { dryRun: true });

    await feature.generate(ctx);

    assert.equal(await fs.readFile(path.join(root, 'composer.json'), 'utf8'), before);
    assert.ok(ctx.messages.includes('Would update composer.json.'));
    assert.ok(ctx.messages.includes('Would update plugin.php.'));
    assert.ok(ctx.messages.some((message) => message.includes('vendor/bin/pest --drift')));
  });

  it('refuses to convert a project that already uses Pest', async () => {
    const root = await fixture();
    await fs.writeFile(path.join(root, 'composer.json'), JSON.stringify({
      'require-dev': { 'pestphp/pest': '^4.0' },
    }));

    await assert.rejects(feature.generate(context(root)), /already requires Pest/);
  });

  it('stops when the user does not confirm', async () => {
    const root = await fixture();
    const ctx = context(root, { inputs: { confirm: false } });

    await feature.generate(ctx);

    assert.deepEqual(ctx.messages, ['Conversion canceled.']);
  });
});

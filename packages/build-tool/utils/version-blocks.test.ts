import {
  mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync,
} from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

import { versionBlocks } from './version-blocks';

describe('versionBlocks', () => {
  let buildDir: string;

  /**
   * Write a built block with the given files beside its block.json.
   */
  function writeBlock(name: string, files: Record<string, string>): void {
    mkdirSync(join(buildDir, name));
    writeFileSync(join(buildDir, name, 'block.json'), JSON.stringify({ name: `test/${name}`, version: '0.1.0' }));
    Object.entries(files).forEach(([file, contents]) => {
      writeFileSync(join(buildDir, name, file), contents);
    });
  }

  /**
   * Version the build and return the version it gave a block.
   */
  function versionAfterRun(name: string): string {
    versionBlocks(buildDir);
    return JSON.parse(readFileSync(join(buildDir, name, 'block.json'), 'utf8')).version;
  }

  beforeEach(() => {
    buildDir = mkdtempSync(join(tmpdir(), 'version-blocks-'));
  });

  afterEach(() => {
    rmSync(buildDir, { recursive: true, force: true });
  });

  test('versions a block by its built files', () => {
    writeBlock('a', { 'index.js': 'one', 'style-index.css': 'two' });
    writeBlock('b', { 'index.js': 'one', 'style-index.css': 'two' });
    writeBlock('c', { 'index.js': 'one', 'style-index.css': 'three' });

    const version = versionAfterRun('a');

    expect(version).toMatch(/^[0-9a-f]{20}$/);
    expect(versionAfterRun('b')).toBe(version);
    expect(versionAfterRun('c')).not.toBe(version);
  });

  test('changes the version when only the PHP or a template changes', () => {
    writeBlock('a', { 'index.js': 'one', 'render.php': '<?php' });
    const version = versionAfterRun('a');

    writeFileSync(join(buildDir, 'a', 'render.php'), '<?php echo 1;');
    const afterPhp = versionAfterRun('a');
    writeFileSync(join(buildDir, 'a', 'template.twig'), '{{ title }}');

    expect(afterPhp).not.toBe(version);
    expect(versionAfterRun('a')).not.toBe(afterPhp);
  });

  test('gives the same version on a second run', () => {
    writeBlock('a', { 'index.js': 'one' });

    expect(versionAfterRun('a')).toBe(versionAfterRun('a'));
  });

  test('skips directories without a block.json, and a missing build', () => {
    mkdirSync(join(buildDir, 'entry'));
    writeFileSync(join(buildDir, 'entry', 'index.js'), 'one');

    expect(() => versionBlocks(buildDir)).not.toThrow();
    expect(() => versionBlocks(join(buildDir, 'missing'))).not.toThrow();
  });
});

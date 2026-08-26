import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadFeaturePackage } from './extensions';

const modulesPath = path.resolve(__dirname, '../../__tests__/fixtures/node_modules');

describe('loadFeaturePackage', () => {
  it('loads a CommonJS package feature', async () => {
    const loaded = await loadFeaturePackage(
      path.join(modulesPath, 'plain-scaffolder/package.json'),
    );

    expect(loaded.packageName).toBe('plain-scaffolder');
    expect(loaded.features).toEqual([
      expect.objectContaining({ name: 'plain-feature', type: 'javascript' }),
    ]);
  });

  it('loads multiple ES module features', async () => {
    const loaded = await loadFeaturePackage(
      path.join(modulesPath, '@fixture/scoped-scaffolder/package.json'),
    );

    expect(loaded.features.map(({ name }) => name)).toEqual(['first-feature', 'second-feature']);
  });

  it('uses the entry point directory for registered features', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffolder-package-'));
    const entryDirectory = path.join(directory, 'extensions');
    const manifestPath = path.join(directory, 'package.json');

    fs.mkdirSync(entryDirectory);
    fs.writeFileSync(manifestPath, JSON.stringify({ name: 'nested-entry', scaffolder: './extensions/entry.cjs' }));
    fs.writeFileSync(path.join(entryDirectory, 'entry.cjs'), "module.exports = { name: 'nested-feature', generate() {} };");

    const loaded = await loadFeaturePackage(manifestPath);

    expect(loaded.directory).toBe(entryDirectory);

    fs.rmSync(directory, { force: true, recursive: true });
  });

  it('rejects a non-object manifest with its package directory name', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffolder-package-'));
    const manifestPath = path.join(directory, 'package.json');

    fs.writeFileSync(manifestPath, 'null');

    await expect(loadFeaturePackage(manifestPath)).rejects.toThrow(path.basename(directory));
    await expect(loadFeaturePackage(manifestPath)).rejects.toThrow('package manifest');

    fs.rmSync(directory, { force: true, recursive: true });
  });

  it.each([
    ['a missing entry point', 'invalid-entry', './missing.cjs', undefined, 'scaffolder'],
    ['a feature without a name', 'invalid-name', './scaffolder.cjs', 'module.exports = { generate() {} };', 'name'],
    ['a feature without generate', 'invalid-generate', './scaffolder.cjs', "module.exports = { name: 'missing-generate' };", 'generate'],
  ])('rejects %s with the package name and invalid field', async (
    _description,
    packageName,
    scaffolder,
    source,
    invalidField,
  ) => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffolder-package-'));
    const manifestPath = path.join(directory, 'package.json');

    fs.writeFileSync(manifestPath, JSON.stringify({ name: packageName, scaffolder }));
    if (source) {
      fs.writeFileSync(path.join(directory, scaffolder), source);
    }

    await expect(loadFeaturePackage(manifestPath)).rejects.toThrow(packageName);
    await expect(loadFeaturePackage(manifestPath)).rejects.toThrow(invalidField);

    fs.rmSync(directory, { force: true, recursive: true });
  });
});

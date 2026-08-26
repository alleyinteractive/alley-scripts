import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadFeatureHooks, loadFeaturePackage } from './extensions';

const modulesPath = path.resolve(__dirname, '../../__tests__/fixtures/node_modules');
const fixturesPath = path.resolve(__dirname, '../../__tests__/fixtures');

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
    ['a feature with invalid prompts', 'invalid-prompts', './scaffolder.cjs', "module.exports = { name: 'invalid-prompts', prompts: true, generate() {} };", 'prompts'],
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

describe('loadFeatureHooks', () => {
  it('loads CommonJS lifecycle hooks relative to the feature directory', async () => {
    const hooks = await loadFeatureHooks(fixturesPath, './hooks/lifecycle.cjs');

    expect(hooks.beforeGenerate).toEqual(expect.any(Function));
    expect(hooks.afterGenerate).toEqual(expect.any(Function));
  });

  it('reports the resolved module and supported hooks when the module is missing', async () => {
    const modulePath = path.resolve(fixturesPath, './hooks/missing.cjs');

    await expect(loadFeatureHooks(fixturesPath, './hooks/missing.cjs')).rejects.toThrow(modulePath);
    await expect(loadFeatureHooks(fixturesPath, './hooks/missing.cjs')).rejects.toThrow('beforeGenerate');
    await expect(loadFeatureHooks(fixturesPath, './hooks/missing.cjs')).rejects.toThrow('afterGenerate');
  });

  it('rejects a module without a supported lifecycle hook', async () => {
    const modulePath = path.resolve(fixturesPath, './hooks/invalid.cjs');

    await expect(loadFeatureHooks(fixturesPath, './hooks/invalid.cjs')).rejects.toThrow(modulePath);
    await expect(loadFeatureHooks(fixturesPath, './hooks/invalid.cjs')).rejects.toThrow('beforeGenerate');
    await expect(loadFeatureHooks(fixturesPath, './hooks/invalid.cjs')).rejects.toThrow('afterGenerate');
  });

  it('rejects a non-function lifecycle hook', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'scaffolder-hooks-'));
    const hooksPath = './invalid.cjs';

    fs.writeFileSync(path.join(directory, hooksPath), 'module.exports = { beforeGenerate: true };');

    await expect(loadFeatureHooks(directory, hooksPath)).rejects.toThrow('beforeGenerate');

    fs.rmSync(directory, { force: true, recursive: true });
  });
});

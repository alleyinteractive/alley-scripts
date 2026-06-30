/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import type { Configuration } from 'webpack';

import { buildConfig } from './webpack.config';

/**
 * Mock the build-tool webpack utilities so the `entries/` directory merge is
 * observable without touching the filesystem, and `processFilename` does not
 * need a real webpack `pathData` object.
 */
jest.mock('../utils/webpack', () => ({
  getEntries: jest.fn(() => ({ 'entries-foo': '/project/entries/foo' })),
  processFilename: jest.fn(() => '[name].js'),
}));

interface BuildConfigOutput extends NonNullable<Configuration['output']> {
  module?: boolean;
  chunkFormat?: string;
}

/**
 * Build a representative wp-scripts script configuration.
 */
const makeScriptWpConfig = (): Configuration => ({
  entry: () => ({ 'block-name/index': '/project/blocks/block-name' }),
  output: {
    path: '/wp-scripts/build',
    filename: 'wp-filename.js',
  },
  plugins: ['wp-plugin-a', 'wp-plugin-b'] as unknown as Configuration['plugins'],
  resolve: {
    alias: { existing: '/existing' },
  },
  devServer: { host: 'localhost' },
} as Configuration);

/**
 * Build a representative wp-scripts module configuration (the one produced
 * under `--experimental-modules` with `output.module === true`).
 */
const makeModuleWpConfig = (): Configuration => ({
  entry: () => ({ 'block-name/view': '/project/blocks/block-name/view' }),
  output: {
    path: '/wp-scripts/build',
    module: true,
    chunkFormat: 'module',
    environment: { module: true },
    library: { type: 'module' },
  } as BuildConfigOutput,
  plugins: ['wp-plugin-a', 'wp-plugin-b'] as unknown as Configuration['plugins'],
  resolve: {
    alias: { existing: '/existing' },
  },
});

describe('buildConfig', () => {
  describe('{ isModule: false, isArrayMode: false } — the classic single-object path', () => {
    it('forces clean, adds the three extra plugins, merges the entries directory, and sets devServer in development', () => {
      const result = buildConfig(makeScriptWpConfig(), { isModule: false, isArrayMode: false });

      // `clean` is forced (development => false), and the property is present.
      expect(result.output).toHaveProperty('clean', false);

      // The three build-tool plugins are appended to the wp-scripts plugins.
      expect(result.plugins).toHaveLength(2 + 3);

      // The script entry merges the `entries/` directory.
      const entry = (result.entry as () => Record<string, string>)();
      expect(entry).toHaveProperty('block-name/index');
      expect(entry).toHaveProperty('entries-foo');

      // devServer is set on the script config in development.
      expect((result as { devServer?: object }).devServer).toMatchObject({ allowedHosts: 'all' });

      // The `@` alias is merged alongside the existing alias.
      expect(result.resolve?.alias).toHaveProperty('@');
      expect(result.resolve?.alias).toHaveProperty('existing', '/existing');
    });

    it('forces clean: true and sets an empty devServer in production', () => {
      jest.isolateModules(() => {
        const originalNodeEnv = process.env.NODE_ENV;
        process.env.NODE_ENV = 'production';

        try {
          const { buildConfig: prodBuildConfig } = require('./webpack.config');
          const result = prodBuildConfig(
            makeScriptWpConfig(),
            { isModule: false, isArrayMode: false },
          );

          expect(result.output).toHaveProperty('clean', true);
          expect(result.devServer).toEqual({});
        } finally {
          process.env.NODE_ENV = originalNodeEnv;
        }
      });
    });
  });

  describe('{ isModule: true, isArrayMode: true } — the module half of a module build', () => {
    const result = buildConfig(makeModuleWpConfig(), { isModule: true, isArrayMode: true });

    it('preserves the module output properties that make it a valid ES module', () => {
      const output = result.output as BuildConfigOutput;
      expect(output.module).toBe(true);
      expect(output.chunkFormat).toBe('module');
      expect(output.environment).toEqual({ module: true });
      expect(output.library).toEqual({ type: 'module' });
    });

    it('does not force clean in array mode', () => {
      expect(result.output).not.toHaveProperty('clean');
    });

    it('adds none of the three extra plugins', () => {
      expect(result.plugins).toHaveLength(2);
    });

    it('sets no devServer', () => {
      expect((result as { devServer?: object }).devServer).toBeUndefined();
    });

    it('passes the wp-scripts entry through untouched (no entries/ merge)', () => {
      const wpConfig = makeModuleWpConfig();
      const moduleResult = buildConfig(wpConfig, { isModule: true, isArrayMode: true });
      expect(moduleResult.entry).toBe(wpConfig.entry);
    });

    it('still merges the @ alias for module source files', () => {
      expect(result.resolve?.alias).toHaveProperty('@');
    });
  });

  describe('{ isModule: false, isArrayMode: true } — the script half of a module build', () => {
    const result = buildConfig(makeScriptWpConfig(), { isModule: false, isArrayMode: true });

    it('retains its three extra plugins', () => {
      expect(result.plugins).toHaveLength(2 + 3);
    });

    it('suppresses clean to avoid the cross-compiler race', () => {
      expect(result.output).not.toHaveProperty('clean');
    });
  });
});

describe('array detection and named exports', () => {
  it('keeps the default export object-shaped (script config) and exposes the module config as a named export when wp-scripts returns an array', () => {
    jest.isolateModules(() => {
      jest.doMock('@wordpress/scripts/config/webpack.config', () => [
        makeScriptWpConfig(),
        makeModuleWpConfig(),
      ], { virtual: false });

      const mod = require('./webpack.config');

      // The default export remains an object (the script config), never an array.
      expect(Array.isArray(mod.default)).toBe(false);
      expect(typeof mod.default).toBe('object');

      // The module config is exposed as a defined named export.
      expect(mod.moduleConfig).not.toBeNull();
      expect((mod.moduleConfig.output as BuildConfigOutput).module).toBe(true);

      jest.dontMock('@wordpress/scripts/config/webpack.config');
    });
  });

  it('exposes a null module config when wp-scripts returns a single object', () => {
    jest.isolateModules(() => {
      jest.doMock('@wordpress/scripts/config/webpack.config', () => makeScriptWpConfig());

      const mod = require('./webpack.config');

      expect(Array.isArray(mod.default)).toBe(false);
      expect(mod.moduleConfig).toBeNull();

      jest.dontMock('@wordpress/scripts/config/webpack.config');
    });
  });
});

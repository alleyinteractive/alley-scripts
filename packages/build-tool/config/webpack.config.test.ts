/* eslint-disable global-require, @typescript-eslint/no-var-requires */
import type { Configuration } from 'webpack';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import { buildConfig, findBlocksManifestPlugin } from './webpack.config';
import { VersionBlocksPlugin } from '../utils/version-blocks';

/**
 * Pull the CleanWebpackPlugin instance out of a built config's plugins and
 * expose its (typed-private) resolved options for assertions.
 */
const getCleanPlugin = (result: Configuration): { cleanOnceBeforeBuildPatterns: string[] } => {
  const plugin = (result.plugins ?? []).find((p) => p instanceof CleanWebpackPlugin);
  expect(plugin).toBeDefined();
  return plugin as unknown as { cleanOnceBeforeBuildPatterns: string[] };
};

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

/**
 * Stand-in for wp-scripts' unexported BlocksManifestPlugin, which build-tool finds by name.
 */
class BlocksManifestPlugin {
  // eslint-disable-next-line class-methods-use-this
  apply(): void {}
}

describe('buildConfig', () => {
  describe('{ isModule: false, isArrayMode: false } — the classic single-object path', () => {
    it('forces clean, adds the four extra plugins, merges the entries directory, and sets devServer in development', () => {
      const result = buildConfig(makeScriptWpConfig(), { isModule: false, isArrayMode: false });

      // `clean` is forced (development => false), and the property is present.
      expect(result.output).toHaveProperty('clean', false);

      // VersionBlocksPlugin is prepended and the three other build-tool plugins appended.
      expect(result.plugins).toHaveLength(1 + 2 + 3);
      expect(result.plugins?.[0]).toBeInstanceOf(VersionBlocksPlugin);

      // The script entry merges the `entries/` directory.
      const entry = (result.entry as () => Record<string, string>)();
      expect(entry).toHaveProperty('block-name/index');
      expect(entry).toHaveProperty('entries-foo');

      // devServer is set on the script config in development.
      expect((result as { devServer?: object }).devServer).toMatchObject({ allowedHosts: 'all' });

      // CleanWebpackPlugin keeps its default initial wipe of the output path.
      expect(getCleanPlugin(result).cleanOnceBeforeBuildPatterns).toEqual(['**/*']);

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

    it('adds only VersionBlocksPlugin, ahead of the wp-scripts plugins', () => {
      expect(result.plugins).toHaveLength(1 + 2);
      expect(result.plugins?.[0]).toBeInstanceOf(VersionBlocksPlugin);
    });

    it('runs the script config\'s blocks manifest plugin after its own plugins', () => {
      const manifestPlugin = { apply: jest.fn() };
      const withManifest = buildConfig(
        makeModuleWpConfig(),
        { isModule: true, isArrayMode: true, blocksManifestPlugin: manifestPlugin },
      );

      expect(withManifest.plugins).toHaveLength(1 + 2 + 1);
      expect(withManifest.plugins?.[0]).toBeInstanceOf(VersionBlocksPlugin);
      expect(withManifest.plugins?.[3]).toBe(manifestPlugin);
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

    it('retains its four extra plugins', () => {
      expect(result.plugins).toHaveLength(1 + 2 + 3);
      expect(result.plugins?.[0]).toBeInstanceOf(VersionBlocksPlugin);
    });

    it('does not add a second blocks manifest plugin', () => {
      const manifestPlugin = { apply: jest.fn() };
      const withManifest = buildConfig(
        makeScriptWpConfig(),
        { isModule: false, isArrayMode: true, blocksManifestPlugin: manifestPlugin },
      );

      expect(withManifest.plugins).not.toContain(manifestPlugin);
    });

    it('suppresses clean to avoid the cross-compiler race', () => {
      expect(result.output).not.toHaveProperty('clean');
    });

    it('disables the CleanWebpackPlugin initial wipe so it cannot delete module output', () => {
      expect(getCleanPlugin(result).cleanOnceBeforeBuildPatterns).toEqual([]);
    });
  });
});

describe('findBlocksManifestPlugin', () => {
  const originalManifestEnv = process.env.WP_BLOCKS_MANIFEST;
  let warn: jest.SpyInstance;

  beforeEach(() => {
    warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warn.mockRestore();
    if (originalManifestEnv === undefined) {
      delete process.env.WP_BLOCKS_MANIFEST;
    } else {
      process.env.WP_BLOCKS_MANIFEST = originalManifestEnv;
    }
  });

  it('returns the BlocksManifestPlugin instance without warning', () => {
    process.env.WP_BLOCKS_MANIFEST = 'true';
    const manifestPlugin = new BlocksManifestPlugin();
    const wpConfig = {
      ...makeScriptWpConfig(),
      plugins: ['wp-plugin-a', manifestPlugin],
    } as unknown as Configuration;

    expect(findBlocksManifestPlugin(wpConfig)).toBe(manifestPlugin);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns when the manifest is enabled but the plugin is missing', () => {
    process.env.WP_BLOCKS_MANIFEST = 'true';

    expect(findBlocksManifestPlugin(makeScriptWpConfig())).toBeUndefined();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('BlocksManifestPlugin was not found'));
  });

  it.each([undefined, 'false', '0'])('does not warn when WP_BLOCKS_MANIFEST is %p', (value) => {
    if (value === undefined) {
      delete process.env.WP_BLOCKS_MANIFEST;
    } else {
      process.env.WP_BLOCKS_MANIFEST = value;
    }

    expect(findBlocksManifestPlugin(makeScriptWpConfig())).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
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

  it('gives the module config the script config\'s BlocksManifestPlugin instance', () => {
    jest.isolateModules(() => {
      const manifestPlugin = new BlocksManifestPlugin();

      jest.doMock('@wordpress/scripts/config/webpack.config', () => [
        { ...makeScriptWpConfig(), plugins: ['wp-plugin-a', manifestPlugin] },
        makeModuleWpConfig(),
      ]);

      const mod = require('./webpack.config');

      // A fresh module registry, so compare by name rather than by class identity.
      expect(mod.moduleConfig.plugins[0].constructor.name).toBe('VersionBlocksPlugin');
      expect(mod.moduleConfig.plugins.at(-1)).toBe(manifestPlugin);

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

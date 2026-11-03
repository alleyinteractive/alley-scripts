import path from 'path';
import { cwd } from 'node:process';
import { Configuration, type PathData, type WebpackPluginInstance } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

// eslint-disable-next-line import/no-unresolved
import { getEntries, processFilename } from '../utils/webpack';
// eslint-disable-next-line import/no-unresolved
import { VersionBlocksPlugin } from '../utils/version-blocks';

interface WPScriptsConfig extends Configuration {
  devServer?: WebpackDevServerConfiguration;
}

/** Controls how a single wp-scripts configuration is transformed. */
interface BuildConfigOptions {
  /** True when this config is the module compiler (`output.module === true`). */
  isModule: boolean;

  /** True when wp-scripts is in dual-compiler (`--experimental-modules`) mode. */
  isArrayMode: boolean;

  /**
   * The script config's wp-scripts BlocksManifestPlugin, when it has one, for the
   * module config to run as well. Ignored for the script config, which has its own.
   */
  blocksManifestPlugin?: WebpackPluginInstance;
}

/**
 * Raw export from the wp-scripts webpack config — a single object normally, or
 * `[scriptConfig, moduleConfig]` under `--experimental-modules`. Detected via
 * `Array.isArray` rather than the env var so we react to the actual structure.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfigExport: WPScriptsConfig | WPScriptsConfig[] = require('@wordpress/scripts/config/webpack.config');

/** True when wp-scripts produced the dual-compiler array configuration. */
const isArrayMode: boolean = Array.isArray(defaultConfigExport);

const isProduction: boolean = process.env.NODE_ENV === 'production';

/**
 * The directory name where the entry point directories are located.
 * These are entries NOT associated with blocks.
 */
const entriesDir: string = process.env.ENTRIES_DIRECTORY || 'entries';

/**
 * Whether to only build blocks from the `--webpack-src-dir` and ignore the
 * entry points in the `--webpack-entries-dir` or 'entries' directory.
 */
const blocksOnly: boolean = process.env.BLOCKS_ONLY === 'true';

/**
 * The mode to run webpack in. Either production or development.
 */
const mode: string = isProduction ? 'production' : 'development';

/**
 * Transform a single wp-scripts configuration into the build-tool customized
 * version. Pure function so it can be unit-tested without a WordPress runtime.
 *
 * @see https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#extending-the-webpack-config
 *
 * @param wpConfig - A single wp-scripts webpack configuration.
 * @param options  - Whether this is the module config and whether array mode is active.
 * @returns The customized webpack configuration.
 */
function buildConfig(
  wpConfig: WPScriptsConfig,
  { isModule, isArrayMode: arrayMode, blocksManifestPlugin }: BuildConfigOptions,
): WPScriptsConfig {
  /**
   * Spread wp-scripts `output` first to preserve the module config's
   * `module: true`, `chunkFormat`, `environment`, and `library` settings;
   * these are harmless on the script config.
   */
  const output: Configuration['output'] = {
    ...wpConfig.output,
    filename: (pathData: PathData) => processFilename(pathData, true, 'js'),
    chunkFilename: (pathData: PathData) => processFilename(pathData, false, 'js', 'runtime'),
    path: path.join(cwd(), 'build'),
  };

  /**
   * Only force `clean` in non-array mode. In array mode both compilers write
   * to `build/` and would clean each other's output; the CLI (`index.ts`)
   * cleans `build/` once before a `build --experimental-modules` run instead.
   */
  if (!arrayMode) {
    output.clean = mode === 'production';
  }

  /**
   * Script config merges `entries/` directory entries into the wp-scripts entry
   * function. Module config passes through untouched — modules are block-only
   * and `entries/` doesn't apply.
   */
  const entry: Configuration['entry'] = isModule
    ? wpConfig.entry
    : () => {
      const rawBlocks = typeof wpConfig.entry === 'function' ? wpConfig.entry() : wpConfig.entry;
      if (rawBlocks && typeof rawBlocks !== 'object') {
        // eslint-disable-next-line no-console
        console.warn('[build-tool] wp-scripts entry returned an unexpected type; block entries will be empty.');
      }
      const blocks = (rawBlocks && typeof rawBlocks === 'object') ? rawBlocks : {};

      const entries = blocksOnly === true ? {} : getEntries(entriesDir);

      return {
        ...blocks,
        ...entries,
      };
    };

  /**
   * Build-tool's extra plugins (Copy, custom MiniCssExtract, CleanWebpack) are
   * added only to the script config. Adding them to the module config would
   * double-copy files, conflict with its CSS-extraction plugin, and clean
   * script-pipeline artifacts.
   */
  const plugins: Configuration['plugins'] = [
    /**
     * Ahead of the defaults, so the blocks are versioned before the manifest is
     * built from them.
     *
     * Both compilers version the blocks. They run in parallel and write into the
     * same block directories, so whichever emits last hashes the complete set of
     * files. A watch-mode change to only a view module rebuilds only the module
     * compiler, which must re-version on its own.
     *
     * This is only race-free because `versionBlocks()` is fully synchronous: a
     * run can't interleave with the other compiler's async writes, and each
     * compiler's raw `block.json` write precedes its own `afterEmit`. Keep it
     * synchronous; an async (`fs/promises`) version could hash a partial set.
     */
    new VersionBlocksPlugin(),
    ...(Array.isArray(wpConfig.plugins) ? wpConfig.plugins : []),
    /**
     * wp-scripts adds BlocksManifestPlugin to the script config only. Run it after
     * the module compiler's versioning too, so a module-only rebuild carries the
     * new versions into the manifest WordPress registers blocks from.
     */
    ...(isModule && blocksManifestPlugin ? [blocksManifestPlugin] : []),
    ...(isModule ? [] : [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/{index.php,*.css}',
            context: entriesDir,
            noErrorOnMissing: true,
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: (pathData: PathData) => processFilename(pathData, true, 'css'),
        chunkFilename: (pathData: PathData) => processFilename(pathData, false, 'css', 'runtime'),
      }),
      new CleanWebpackPlugin({
        /**
         * CleanWebpackPlugin defaults `cleanOnceBeforeBuildPatterns` to a
         * wipe-everything glob that fires at this compiler's `emit` hook. In
         * array mode the module compiler emits into the shared `build/`
         * first, so that default wipe would delete the module output.
         * Disable it in array mode (mirroring the `output.clean` suppression
         * above) while keeping the after-build CSS dedup below. The CLI
         * pre-cleans `build/` for production array-mode builds instead.
         */
        ...(arrayMode ? { cleanOnceBeforeBuildPatterns: [] } : {}),
        cleanAfterEveryBuildPatterns: [
          /**
           * Remove duplicate entry CSS files generated from default
           * MiniCssExtractPlugin plugin in wpScripts.
           *
           * The default MiniCssExtractPlugin filename is [name].css
           * resulting in the generation of the `${entriesDir}-*.css` files.
           * The configuration in this file for MiniCssExtractPlugin outputs
           * the entry CSS into the entry src directory name.
           */
          `${entriesDir}-*.css`,
          // Maps are built when running the start mode with wpScripts.
          `${entriesDir}-*.css.map`,
        ],
        protectWebpackAssets: false,
      }),
    ]),
  ];

  const customConfig: WPScriptsConfig = {
    ...wpConfig,
    entry,
    output,
    plugins,

    // `@` alias merged for both configs so module source files share the same import ergonomics.
    resolve: {
      ...wpConfig.resolve,
      alias: {
        ...wpConfig?.resolve?.alias,
        '@': path.resolve(cwd()),
      },
    },
  };

  /**
   * `devServer` only on the script config. In a multi-compiler array, webpack
   * reads devServer from the first config only; a block on the module config is dead.
   */
  if (!isModule) {
    customConfig.devServer = mode === 'production' ? {} : {
      ...wpConfig.devServer,
      allowedHosts: 'all',
      static: {
        directory: '/build',
      },
    };
  }

  return customConfig;
}

/**
 * Find wp-scripts' BlocksManifestPlugin instance in the script config.
 *
 * The class isn't exported by wp-scripts, so its instance is found by constructor name. If
 * wp-scripts renames it, module-only rebuilds would silently stop refreshing the manifest,
 * so warn when the manifest is enabled (`WP_BLOCKS_MANIFEST`, parsed the way wp-scripts
 * parses it) but no instance is found.
 *
 * @param wpConfig - The wp-scripts script configuration.
 * @returns The plugin instance, or undefined when there is none.
 */
function findBlocksManifestPlugin(wpConfig?: WPScriptsConfig): WebpackPluginInstance | undefined {
  const plugin = wpConfig?.plugins?.find(
    (p): p is WebpackPluginInstance => p?.constructor?.name === 'BlocksManifestPlugin',
  );

  const manifestEnv = process.env.WP_BLOCKS_MANIFEST;
  const manifestExpected = !!manifestEnv && manifestEnv !== 'false' && manifestEnv !== '0';

  if (!plugin && manifestExpected) {
    // eslint-disable-next-line no-console
    console.warn('[build-tool] WP_BLOCKS_MANIFEST is enabled but wp-scripts\' BlocksManifestPlugin was not found; the blocks manifest will not refresh on module-only rebuilds.');
  }

  return plugin;
}

/** Script config: the element without `output.module`, or the single export in non-array mode. */
const scriptWpConfig: WPScriptsConfig | undefined = isArrayMode
  ? (defaultConfigExport as WPScriptsConfig[]).find((c) => c.output?.module !== true)
  : (defaultConfigExport as WPScriptsConfig);

/**
 * Module config identified by `output.module === true` rather than array index —
 * module output is a webpack invariant; array order is a wp-scripts convention.
 * Only present in array mode.
 */
const moduleWpConfig: WPScriptsConfig | undefined = isArrayMode
  ? (defaultConfigExport as WPScriptsConfig[]).find((c) => c.output?.module === true)
  : undefined;

/**
 * Default export is always the script config (never an array), even under
 * `--experimental-modules`. This preserves the `defaultConfig.default.entry()`
 * extension pattern, which would throw if the default export became an array.
 */
const config: Configuration = scriptWpConfig
  ? buildConfig(scriptWpConfig, { isModule: false, isArrayMode })
  : {};

/**
 * Named export for the module config when in `--experimental-modules` mode;
 * `null` otherwise. The extended config assembles this and `config` into the
 * array webpack runs.
 */
const moduleConfig: Configuration | null = moduleWpConfig
  ? buildConfig(moduleWpConfig, {
    isModule: true,
    isArrayMode,
    blocksManifestPlugin: findBlocksManifestPlugin(scriptWpConfig),
  })
  : null;

export { buildConfig, findBlocksManifestPlugin, moduleConfig };
export default config;

import path from 'path';
import { cwd } from 'node:process';
import { Configuration, type PathData } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

import { getConfigByType, getEntries, processFilename } from '../utils/webpack';

interface WPScriptsConfig extends Configuration {
  devServer?: WebpackDevServerConfiguration;
}

// eslint-disable-next-line @typescript-eslint/no-var-requires,max-len
const wpScriptsConfig: WPScriptsConfig | WPScriptsConfig[] = require('@wordpress/scripts/config/webpack.config');

/**
 * Check if the build is running in production mode.
 */
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
 * Whether to use experimental modules in the build.
 */
const experimentalModules: boolean = process.env.WP_EXPERIMENTAL_MODULES === 'true';

/**
 * The mode to run webpack in. Either production or development.
 */
const mode: string = isProduction ? 'production' : 'development';

// const defaultConfig = Array.isArray(wpScriptsConfig) ? wpScriptsConfig[0] : wpScriptsConfig;

/**
 * Generate the base webpack configuration.
 *
 * @param defaultConfig - The default webpack configuration from @wordpress/scripts.
 * @returns The generated webpack configuration.
 */
function generateBaseConfig(defaultConfig: WPScriptsConfig): Configuration {
  return {
    ...defaultConfig,

    // Dynamically produce entries from the slotfills index file and all blocks.
    entry: () => {
      let blocks = typeof defaultConfig.entry === 'function' ? defaultConfig.entry() : {};
      blocks = blocks && typeof blocks === 'object' ? blocks : {};

      const entries = blocksOnly === true ? {} : getEntries(entriesDir);

      return {
        ...blocks,
        ...entries,
      };
    },

    /**
     * This configuration option is being overridden from the default wp-scripts
     * config in order to process the build so that each entry point is output
     * to its own directory.
     *
     * The 'build' output path is maintained due to the
     * devServer configuration from wp-scripts.
     */
    output: {
      clean: mode === 'production' && !experimentalModules,

      filename: (pathData: PathData) => processFilename(pathData, true, 'js'),
      chunkFilename: (pathData: PathData) => processFilename(pathData, false, 'js', 'runtime'),
      path: path.join(cwd(), 'build'),
    },

    // Configure plugins.
    plugins: [
      ...(Array.isArray(defaultConfig.plugins) ? defaultConfig.plugins : []),
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
        cleanOnceBeforeBuildPatterns: [],
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
    ],

    // This webpack alias rule is needed at the root to ensure that the paths are resolved
    // using the custom alias defined below.
    resolve: {
      ...defaultConfig.resolve,
      alias: {
        ...defaultConfig?.resolve?.alias,
        // Custom alias to resolve paths to the project root. Example: '@/client/src/index.js'.
        '@': path.resolve(cwd()),
      },
    },

    devServer: mode === 'production' ? {} : {
      ...defaultConfig.devServer,
      allowedHosts: 'all',
      static: {
        directory: '/build',
      },
    },
  };
}

/**
 * Create the final webpack configuration.
 */
function createWebpackConfig(): Configuration | Configuration[] {
  // If we don't have a configuration, return an empty object.
  if (!wpScriptsConfig) {
    return {};
  }

  // If we're supporting experimental modules and have an array of configs.
  if (experimentalModules && Array.isArray(wpScriptsConfig)) {
    return [
      generateBaseConfig(getConfigByType('script', wpScriptsConfig)),
      getConfigByType('module', wpScriptsConfig),
    ];
  }

  /**
   * Generate the base configuration.
   *
   * The additional ternary is to help TypeScript infer the proper type of wpScriptsConfig.
   */
  return generateBaseConfig(
    Array.isArray(wpScriptsConfig)
      ? wpScriptsConfig[0]
      : wpScriptsConfig,
  );
}

/**
 * Webpack configuration.
 *
 * This webpack configuration is an extension of the default configuration
 * provided by @wordpress/scripts. Read the documentation for
 * extending the wp-scripts webpack configuration for more information.
 *
 * @see https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#extending-the-webpack-config
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/scripts/config/webpack.config.js
 */
const config = createWebpackConfig();
export default config;

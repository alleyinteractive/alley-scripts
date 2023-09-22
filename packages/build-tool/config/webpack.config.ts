import path from 'path';
import { cwd } from 'node:process';
import webpack from 'webpack';

import CopyWebpackPlugin from 'copy-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

// eslint-disable-next-line import/no-unresolved
import { getEntries, processFilename, type PathData } from '../utils/webpack';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const defaultConfig: webpack.Configuration = require('@wordpress/scripts/config/webpack.config');

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
 * The mode to run webpack in. Either production or development.
 */
const mode: string = isProduction ? 'production' : 'development';

/**
 * webpack configuration.
 *
 * This webpack configuration is an extension of the default configuration
 * provided by @wordpress/scripts. Read the documentation for
 * extending the wp-scripts webpack configuration for more information.
 *
 * @see https://github.com/WordPress/gutenberg/tree/trunk/packages/scripts#extending-the-webpack-config
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/scripts/config/webpack.config.js
 */
const config = (): webpack.Configuration => ({
  ...defaultConfig,

  // Dynamically produce entries from the slotfills index file and all blocks.
  entry: () => {
    const blocks = defaultConfig.entry();

    return {
      ...blocks,
      ...getEntries(entriesDir),
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
    clean: mode === 'production',

    filename: (pathData: PathData) => processFilename(pathData, true, 'js'),
    chunkFilename: (pathData: PathData) => processFilename(pathData, false, 'js', 'runtime'),
    path: path.join(cwd(), 'build'),
  },

  // Configure plugins.
  plugins: [
    ...defaultConfig.plugins,
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
      ...defaultConfig.resolve.alias,
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
});

export default config;

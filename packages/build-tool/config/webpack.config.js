const path = require('path');
const { cwd } = require('node:process');

const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const { processFilename, getEntries } = require('../utils');

/**
 * INPUT VARIABLES TO CUSTOMIZE BUILD.
 * - All Webpack parameters.
 * - Options object ?
 * - BUILD DIRECTORY PATH
 * - ENTRY POINT DIRECTORY (Obj or dir) (entries)
 * - BLOCKS DIR
 * - Use @wordpress/scripts ?
 * -
 */

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const cwdPath = cwd();

const config = () => {
  console.log('RUNNING ALLEY BUILD');
  return {
    ...defaultConfig,

    // Dynamically produce entries from the slotfills index file and all blocks.
    entry: () => {
      const blocks = defaultConfig.entry();

      return {
        ...blocks,
        ...getEntries('entries'),
        ...{
          // All other custom entry points can be included here.
        },
      };
    },

    // Use different filenames for production and development builds for clarity.
    output: {
      clean: mode === 'production',
      filename: (pathData) => processFilename(pathData, true, 'js'),
      chunkFilename: (pathData) => processFilename(pathData, false, 'js', 'runtime'),
      path: path.join(cwdPath, 'build'),
    },

    // Configure plugins.
    plugins: [
      ...defaultConfig.plugins,
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '**/{index.php,*.css}',
            context: 'entries',
            noErrorOnMissing: true,
          },
        ],
      }),
      new MiniCssExtractPlugin({
        filename: (pathData) => processFilename(pathData, true, 'css'),
        chunkFilename: (pathData) => processFilename(pathData, false, 'css', 'runtime'),
      }),
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: [
          /**
           * Remove duplicate entry CSS files generated from default
           * MiniCssExtractPlugin plugin in wpScripts.
           *
           * The default MiniCssExtractPlugin filename is [name].css
           * resulting in the generation of the entries-*.css files.
           * The configuration in this file for MiniCssExtractPlugin outputs
           * the entry CSS into the entry src directory name.
           */
          'entries-*.css',
          // Maps are built when running the start mode with wpScripts.
          'entries-*.css.map',
        ],
        protectWebpackAssets: false,
      }),
    ],

    // This webpack alias rule is needed at the root to ensure that the paths are resolved
    // using the custom alias defined below.
    resolve: {
      alias: {
        ...defaultConfig.resolve.alias,
        '@': path.resolve(cwdPath),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '...'],
    },

    devServer: mode === 'production' ? {} : {
      ...defaultConfig.devServer,
      allowedHosts: 'all',
      static: {
        directory: '/build',
      },
    },
  };
};

module.exports = config;

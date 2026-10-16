import fs from 'fs';
import path from 'path';
import type { Configuration } from 'webpack';
import DependencyExtractionWebpackPlugin from '@wordpress/dependency-extraction-webpack-plugin';
import autoprefixer from 'autoprefixer';

type Entries = Record<string, { import: string, filename: string }>;

/**
 * Create entry points from a directory path while maintaining the directory structure.
 *
 * The function will create entries from nested directories if there is an index file.
 * The entry name will be the directory name.
 *
 * @param {string} directoryPath - The path to the directory to search.
 * @returns An object of entries.
 */
function createEntriesPerDirPath(directoryPath: string): Entries {
  // Check if the directory exists before continuing.
  const directoryExists = fs.existsSync(directoryPath);

  if (directoryExists) {
    // Read the directory and reduce its content to an entries object.
    return fs.readdirSync(directoryPath)
      .reduce((acc: Entries, dirItemName) => {
        // Define the full path of the current directory item.
        const fullPath = path.join(directoryPath, dirItemName);

        // Define the base directory.
        const baseDir = '/src/';
        // Initialize an object to hold nested entries.
        let nestedEntries: Entries = {};

        if (fs.statSync(fullPath).isDirectory()) {
          // Ensure that the directory has an index file.
          const indexExists = ['ts', 'tsx']
            .some((ext) => fs.existsSync(path.join(fullPath, `index.${ext}`)));

          if (indexExists) {
            // Get the relative path from the base directory `src/`.
            const relativePath = fullPath.substring(fullPath.indexOf(baseDir) + baseDir.length);

            // Add the current directory item to the entries object.
            acc[dirItemName] = {
              import: fullPath,
              filename: `${relativePath}/index.js`,
            };
          }

          // If current item is a directory, call the function recursively.
          nestedEntries = createEntriesPerDirPath(fullPath);
        }

        // Return the entries object with the nested entries added
        return { ...acc, ...nestedEntries };
      }, {});
  }
  return {};
}

export default (
  _env: Record<string, unknown>,
  { mode }: { mode?: Configuration['mode'] },
): Configuration => ({
  /*
   * See https://webpack.js.org/configuration/devtool/ for an explanation of how
   * to configure this directive. We are using the recommended options for
   * production and development mode that produce high quality source maps.
   * However, the performance of these options is not stellar, so if you
   * notice that the build performance in your project is suffering to an
   * unacceptable degree, you can choose different options from the link above.
   */
  devtool: mode === 'production' ? 'source-map' : 'eval-source-map',

  entry: {
    // The main entry point.
    ...{ index: './src' },
    // Process the directories, in the 'src' directory, into their own entry points.
    ...createEntriesPerDirPath(path.join(process.cwd(), 'src')),
  },

  // Configure loaders based on extension.
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              transpileOnly: false,
            },
          },
        },
      },
      {
        exclude: /node_modules/,
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [autoprefixer()],
              },
            },
          },
          'resolve-url-loader',
          'sass-loader',
        ],
      },
    ],
  },

  // Use different filenames for production and development builds for clarity.
  output: {
    clean: mode === 'production',
    library: {
      type: 'umd',
    },
    filename: mode === 'production' ? '[name].bundle.min.js' : '[name].js',
    path: path.join(__dirname, 'build'),
  },

  // Configure plugins.
  plugins: [
    // This maps references to @wordpress/{package-name} to the wp object.
    new DependencyExtractionWebpackPlugin({
      outputFormat: 'json',
      combineAssets: true,
    }),
  ],

  resolve: {
    // `.js` stays so extensionless imports inside dependencies still resolve.
    extensions: ['.tsx', '.ts', '.js'],
  },

  // Cache the generated webpack modules and chunks to improve build speed.
  // @see https://webpack.js.org/configuration/cache/
  cache: {
    type: 'filesystem',
  },
});

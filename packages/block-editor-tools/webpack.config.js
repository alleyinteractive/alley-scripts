const path = require('path');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = (env, { mode }) => ({
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
    index: './src',
  },

  // Configure loaders based on extension.
  module: {
    rules: [
      {
        exclude: /node_modules/,
        test: /\.(j|t)sx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            compilerOptions: {
              transpileOnly: true,
              experimentalWatchApi: true,
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
    new DependencyExtractionWebpackPlugin({}),
  ],

  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },

  // Cache the generated webpack modules and chunks to improve build speed.
  // @see https://webpack.js.org/configuration/cache/
  cache: {
    type: 'filesystem',
  },
});

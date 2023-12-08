import deepExtend from 'deep-extend';

import config from './webpack.config';
import { getUserWebpackConfig } from '../utils';

/**
 * This file is the last step in the webpack config generation process.
 * It takes the default config (extended from wp-scripts config) found in ./webpack.config.ts
 * and extends it with the user's config here with deepExtend.
 *
 * The config path to this built file is passed to webpack as the --config flag.
 */
deepExtend(
  config,
  getUserWebpackConfig(),
);

export default config;

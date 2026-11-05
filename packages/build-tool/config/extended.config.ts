/* eslint-disable import/no-extraneous-dependencies */
import deepExtend from 'deep-extend';

import config, { moduleConfig } from './webpack.config';
import { getUserWebpackConfig } from '../utils';

/**
 * This file is the last step in the webpack config generation process.
 * It takes the default config (extended from wp-scripts config) found in ./webpack.config.ts
 * and extends it with the user's config here with deepExtend.
 *
 * The config path to this built file is passed to webpack as the --config flag.
 *
 * User overrides apply to the script config only. This matches the actual
 * extension use case (adding script/CSS entries such as block styles) and
 * avoids clobbering the module compiler's distinct entry set. The module config
 * already carries build-tool's `@` alias via webpack.config.ts.
 */
deepExtend(
  config,
  getUserWebpackConfig(),
);

/**
 * In module mode (`--experimental-modules`), webpack receives an array of both
 * compilers: the script config (with user overrides merged) and the module
 * config. Otherwise webpack receives the single script config object.
 */
export default moduleConfig ? [config, moduleConfig] : config;

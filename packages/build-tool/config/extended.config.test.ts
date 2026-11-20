/* eslint-disable no-console, import/no-extraneous-dependencies */
import path from 'path';
import fs from 'fs';
import deepExtend from 'deep-extend';

import config from './webpack.config';
import { getUserWebpackConfig } from '../utils';

describe('Test merging webpack configs', () => {
  const rootWebpackConfigPath = path.join(process.cwd(), 'webpack.config.js');

  afterEach(() => {
    jest.resetAllMocks();

    try {
      fs.unlinkSync(rootWebpackConfigPath);
      // file removed
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });

  test('The default Webpack configuration should be deeply extended.', () => {
    // Define the contents to write to the file
    const fileContents = {
      entry: {
        main: './hello/index.js',
      },
      output: {
        asyncChunks: true,
      },
      resolve: {
        alias: {
          '@': 'path/to/some/folder',
        },
      },
    };

    // create webpack config file in project root.
    try {
      fs.writeFileSync(rootWebpackConfigPath, `module.exports = ${JSON.stringify(fileContents)}`);
      // file written successfully
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }

    deepExtend(config, getUserWebpackConfig());

    expect(config).toMatchObject(fileContents);
    // @ts-ignore Extended config temporarily has no type until test runtime.
    expect(config?.resolve?.alias).toHaveProperty('@', fileContents.resolve.alias['@']);
    // @ts-ignore
    expect(config?.output).toHaveProperty('asyncChunks', fileContents.output.asyncChunks);
  });
});

describe('Extended configuration in module mode (--experimental-modules)', () => {
  const rootWebpackConfigPath = path.join(process.cwd(), 'webpack.config.js');

  afterEach(() => {
    jest.resetModules();

    try {
      fs.unlinkSync(rootWebpackConfigPath);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  });

  test('exports an array, merging the user override into the script config only.', () => {
    // The user override that should land on the script config but NOT the module config.
    const fileContents = {
      output: {
        asyncChunks: true,
      },
    };

    fs.writeFileSync(rootWebpackConfigPath, `module.exports = ${JSON.stringify(fileContents)}`);

    jest.isolateModules(() => {
      // Force wp-scripts to return its dual-compiler array shape.
      jest.doMock('@wordpress/scripts/config/webpack.config', () => [
        {
          entry: () => ({ 'block-name/index': '/project/blocks/block-name' }),
          output: { path: '/wp-scripts/build' },
          plugins: [],
          resolve: { alias: {} },
        },
        {
          entry: () => ({ 'block-name/view': '/project/blocks/block-name/view' }),
          output: { path: '/wp-scripts/build', module: true },
          plugins: [],
          resolve: { alias: {} },
        },
      ]);

      // eslint-disable-next-line global-require, @typescript-eslint/no-var-requires
      const extendedConfig = require('./extended.config').default;

      // In module mode the export is an array of [scriptConfig, moduleConfig].
      expect(Array.isArray(extendedConfig)).toBe(true);
      expect(extendedConfig).toHaveLength(2);

      const [scriptConfig, moduleConfig] = extendedConfig;

      // The user override is merged into the script config.
      expect(scriptConfig.output).toHaveProperty('asyncChunks', true);

      // The module config is identified by output.module and is left untouched
      // by the user override.
      expect(moduleConfig.output).toHaveProperty('module', true);
      expect(moduleConfig.output).not.toHaveProperty('asyncChunks');

      jest.dontMock('@wordpress/scripts/config/webpack.config');
    });
  });
});

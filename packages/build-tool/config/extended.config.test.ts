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

  test.todo('getUserWebpackConfig should be able to handle an array of webpack configs.');
});

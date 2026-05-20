import path from 'path';

import config from './webpack.config';

describe('webpack config', () => {
  it('serves static assets from the current project build directory in development', () => {
    expect(config.devServer).toMatchObject({
      static: {
        directory: path.join(process.cwd(), 'build'),
      },
    });
  });
});

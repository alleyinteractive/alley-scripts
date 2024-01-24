import path from 'path';

export const DEFAULT_CONFIGURATION = typeof jest === 'undefined' ? {
  sources: [],
} : {
  sources: [
    {
      root: path.resolve(__dirname, '../..'),
      directory: './__tests__/fixtures/a-features',
    },
  ],
};

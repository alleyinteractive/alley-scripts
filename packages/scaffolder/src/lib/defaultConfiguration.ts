import path from 'node:path';

export const DEFAULT_CONFIGURATION = typeof jest === 'undefined' ? {
  features: [],
  sources: [],
} : {
  features: [],
  sources: [
    {
      root: path.resolve(__dirname, '../..'),
      directory: './__tests__/fixtures/a-features',
    },
  ],
};

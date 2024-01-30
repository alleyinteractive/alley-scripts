import path from 'node:path';
import { Configuration } from '../types';

/**
 * Default configuration of the scaffolder.
 */
export const DEFAULT_CONFIGURATION: Configuration = typeof jest === 'undefined' ? {
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

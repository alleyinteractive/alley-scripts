import path from 'node:path';
import type { Configuration } from './types';

/**
 * Default configuration of the scaffolder.
 */
export const DEFAULT_CONFIGURATION: Configuration = typeof jest === 'undefined' ? {
  // TODO: Move these to a separate NPM package.
  features: [{
    name: 'create-wordpress-plugin',
    type: 'repository',
    inputs: [{
      name: 'name',
      description: 'The name of the plugin',
      type: 'string',
      required: true,
    }],
    repository: {
      github: 'alleyinteractive/create-wordpress-plugin',
      destination: '{{ dasherize inputs.name }}',
      postCloneCommand: 'php configure.php',
    },
  }],
  sources: [],
} : {
  features: [],
  sources: [
    {
      root: path.resolve(__dirname, '..'),
      directory: './__tests__/fixtures/a-features',
    },
  ],
};

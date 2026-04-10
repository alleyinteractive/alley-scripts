import { defineConfig } from 'oxlint';

// oxlint-disable-next-line import/extensions -- Node ESM requires explicit .js extensions for local imports
import oxlintConfig from './index.js';

export default defineConfig({
  extends: [oxlintConfig],
});

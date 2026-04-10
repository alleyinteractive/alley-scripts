import { defineConfig } from 'oxfmt';

// oxlint-disable-next-line import/extensions -- Node ESM requires explicit .js extensions for local imports
import oxfmtConfig from './fmt.js';

export default defineConfig(oxfmtConfig);

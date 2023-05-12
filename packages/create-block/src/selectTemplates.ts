import path from 'path';
import { fileURLToPath } from 'url';
import defaultValues from './defaultValues.js';

/**
 * __filename and __dirname are not available in ES Modules.
 * See: https://nodejs.org/api/esm.html#no-__filename-or-__dirname
 */
const dirName = path.dirname(fileURLToPath(import.meta.url));

const blockLanguage = process.env.blockLanguage || 'typescript';

// This path should be relative to the dist folder.
const blockTemplatesPath = path.join(dirName, '../../templates', blockLanguage);

/**
 * Custom variants for scaffolding blocks.
 *
 * Currently there are only two variants:
 * - static:  A block that scaffolds a save.js file
 *            that saves the content and markup directly in the post content.
 * - dynamic: A block that scaffolds a render.php template
 *            which can be used to render the block on the front-end.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/create-block/docs/external-template.md#external-project-templates
 */
export default {
  defaultValues,
  variants: {
    static: {
      
      blockTemplatesPath,
    },
    dynamic: {
      blockTemplatesPath,
      render: 'file:render.php',
    },
  },
  blockTemplatesPath,
};

// @ts-ignore
const path = require('path');
const defaultValues = require('./defaultValues.js');

const templateDirectory = process.env.blockLanguage || 'typescript';

// This path should be relative to the dist folder.
const blockTemplatesPath: string = path.join(__dirname, '../../templates', templateDirectory);

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
module.exports = {
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

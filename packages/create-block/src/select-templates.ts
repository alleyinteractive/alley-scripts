/* eslint-disable no-console, no-param-reassign */
const path = require('path');

const {
  blockLanguage = 'typescript',
  hasViewScript = 'false',
} = process.env;

// The javascript or typescript script suffix or filetype based on the block language.
const scriptSuffix: string = blockLanguage === 'typescript' ? 'ts' : 'js';

// This path should be relative to the dist folder.
const blockTemplatesPath: string = path.join(__dirname, '../../templates', blockLanguage);

const viewScript = hasViewScript === 'true' ? {
  viewScript: [`file:view.${scriptSuffix}`],
} : {};

/**
 * Custom variants for scaffolding blocks.
 *
 * Currently there are only two variants:
 * - dynamic: A block that scaffolds a render.php template
 *            which can be used to render the block on the front-end.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/create-block/docs/external-template.md#external-project-templates
 */
module.exports = {
  /**
   * Default variables for scaffolding blocks.
   *
   * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/create-block/docs/external-template.md#defaultvalues
   */
  defaultValues: {
    namespace: process.env.namespace || 'create-block',
    plugin: false,
    description: '',
    dashicon: 'palmtree',
    category: 'widgets',
    editorScript: `file:index.${scriptSuffix}`,
    editorStyle: 'file:index.css',
    style: ['file:style-index.css'],
    ...viewScript,
    transformer: (view: {
      title?: string;
      slug?: string;
    }) => {
      // Ensure the block has a generated title.
      if (!view.title && view.slug) {
        view.title = view.slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }

      return {
        ...view,
        // Set the variable that is used in the templates to conditionally
        // register the block in the index.php file.
        shouldRegisterBlock: process.env.shouldRegisterBlock === 'true',
      };
    },
  },
  variants: {
    dynamic: {
      blockTemplatesPath,
      render: 'file:render.php',
    },
  },
  blockTemplatesPath,
};

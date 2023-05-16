/**
 * Default variables for scaffolding blocks.
 *
 * @see https://github.com/WordPress/gutenberg/blob/trunk/packages/create-block/docs/external-template.md#defaultvalues
 */
module.exports = {
  namespace: process.env.namespace || 'create-block',
  plugin: false,
  description: '',
  dashicon: 'palmtree',
  category: 'widgets',
  editorScript: 'file:index.ts',
  editorStyle: 'file:index.css',
  style: ['file:style-index.css'],
};

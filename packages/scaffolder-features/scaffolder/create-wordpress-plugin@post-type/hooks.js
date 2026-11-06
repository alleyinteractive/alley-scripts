import {
  parseList,
  phpString,
  phpStringList,
  prepareFeature,
  registerFeature,
  validateSlug,
} from '../../src/create-wordpress-plugin/index.js';

export async function beforeGenerate(context) {
  const { inputs } = context;

  validateSlug(inputs.slug, 20, 'post type');

  const prepared = await prepareFeature(context, {
    slug: inputs.slug,
    suffix: 'Post_Type',
    singular: inputs.singular,
    plural: inputs.plural,
  });

  Object.assign(inputs, prepared);

  inputs.php.menuIcon = phpString(inputs.menuIcon);
  inputs.php.rewriteSlug = phpString(inputs.rewriteSlug || inputs.slug);
  inputs.php.supports = phpStringList(parseList(inputs.supports));
}

export async function afterGenerate(context) {
  await registerFeature(context);
}

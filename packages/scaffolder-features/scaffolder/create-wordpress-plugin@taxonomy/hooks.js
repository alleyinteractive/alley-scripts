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

  validateSlug(inputs.slug, 32, 'taxonomy');

  const objectTypes = parseList(inputs.objectTypes);

  if (!objectTypes.length) {
    throw new Error('Pass at least one post type in objectTypes, e.g. post,page.');
  }

  objectTypes.forEach((objectType) => validateSlug(objectType, 20, 'post type'));

  const prepared = await prepareFeature(context, {
    slug: inputs.slug,
    suffix: 'Taxonomy',
    singular: inputs.singular,
    plural: inputs.plural,
  });

  Object.assign(inputs, prepared);

  inputs.php.objectTypes = phpStringList(objectTypes);
  inputs.php.rewriteSlug = phpString(inputs.rewriteSlug || inputs.slug);
}

export async function afterGenerate(context) {
  await registerFeature(context);
}

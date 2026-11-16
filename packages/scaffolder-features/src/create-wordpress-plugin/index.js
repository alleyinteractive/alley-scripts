import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const FEATURES_MARKER = /^([ \t]*)\/\/ Add features here\.[ \t]*$/m;

export const wordsFromSlug = (slug) => slug.split(/[-_]+/).filter(Boolean);

export const className = (slug, suffix) => [
  ...wordsFromSlug(slug).map((word) => word.charAt(0).toUpperCase() + word.slice(1)),
  suffix,
].join('_');

export const classFilename = (name) => `class-${name.toLowerCase().replace(/_/g, '-')}.php`;

export const pluralize = (word) => {
  if (/[^aeiou]y$/i.test(word)) {
    return `${word.slice(0, -1)}ies`;
  }

  if (/(s|x|z|ch|sh)$/i.test(word)) {
    return `${word}es`;
  }

  return `${word}s`;
};

/**
 * Lowercase a label for mid-sentence use, leaving acronyms and mixed-case words alone.
 */
export const lowercaseLabel = (label) => label
  .split(' ')
  .map((word) => (word.slice(1) === word.slice(1).toLowerCase() ? word.toLowerCase() : word))
  .join(' ');

export const phpString = (value) => `${value}`.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

export const phpStringList = (values) => values.map((value) => `'${phpString(value)}'`).join(', ');

export const parseList = (value) => `${value || ''}`
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);

export const validateSlug = (slug, maxLength, label) => {
  if (!/^[a-z0-9_-]+$/.test(slug)) {
    throw new Error(`The ${label} slug "${slug}" may only contain lowercase letters, numbers, dashes, and underscores.`);
  }

  if (slug.length > maxLength) {
    throw new Error(`The ${label} slug "${slug}" is longer than ${maxLength} characters, which WordPress does not allow.`);
  }
};

/**
 * Find the plugin's root namespace and text domain.
 */
export const detectPlugin = async (root) => {
  const mainFile = path.join(root, 'src', 'main.php');

  if (!existsSync(mainFile)) {
    throw new Error(`No src/main.php found in ${root}. Run this feature from the root of a plugin created from create-wordpress-plugin.`);
  }

  const namespace = (await fs.readFile(mainFile, 'utf8')).match(/^namespace\s+([^;\s]+)\s*;/m)?.[1];

  if (!namespace) {
    throw new Error(`Could not find a namespace declaration in ${mainFile}.`);
  }

  let textDomain = null;

  const phpFiles = (await fs.readdir(root)).filter((file) => file.endsWith('.php'));

  for (const file of phpFiles) { // eslint-disable-line no-restricted-syntax
    const contents = await fs.readFile(path.join(root, file), 'utf8'); // eslint-disable-line no-await-in-loop

    if (/^[ \t/*#@]*Plugin Name:/im.test(contents)) {
      textDomain = contents.match(/^[ \t/*#@]*Text Domain:\s*(\S+)/im)?.[1] || null;
      break;
    }
  }

  return {
    namespace,
    textDomain: textDomain || path.basename(root),
  };
};

/**
 * Add `new Features\<Class>()` to the feature group in src/main.php.
 *
 * @returns {{ contents: string, status: 'inserted' | 'exists' | 'missing-marker' }}
 */
export const registerFeatureInMain = (contents, featureClass) => {
  if (contents.includes(`Features\\${featureClass}(`)) {
    return { contents, status: 'exists' };
  }

  const match = contents.match(FEATURES_MARKER);

  if (!match) {
    return { contents, status: 'missing-marker' };
  }

  return {
    contents: contents.replace(FEATURES_MARKER, `${match[1]}new Features\\${featureClass}(),\n${match[0]}`),
    status: 'inserted',
  };
};

/**
 * Validate a feature's destination and resolve the values shared by its stubs.
 */
export const prepareFeature = async (context, { slug, suffix, singular, plural }) => {
  const root = context.resolveDestination('');
  const { namespace, textDomain } = await detectPlugin(root);
  const featureClass = className(slug, suffix);
  const file = `src/features/${classFilename(featureClass)}`;

  if (existsSync(path.join(root, file))) {
    throw new Error(`${file} already exists.`);
  }

  const resolvedPlural = plural || pluralize(singular);

  return {
    className: featureClass,
    fileName: classFilename(featureClass),
    namespace: `${namespace}\\Features`,
    textDomain,
    plural: resolvedPlural,
    php: {
      slug: phpString(slug),
      textDomain: phpString(textDomain),
      singular: phpString(singular),
      plural: phpString(resolvedPlural),
      singularLower: phpString(lowercaseLabel(singular)),
      pluralLower: phpString(lowercaseLabel(resolvedPlural)),
    },
  };
};

/**
 * Register the generated feature in src/main.php.
 */
export const registerFeature = async (context) => {
  const { className: featureClass } = context.inputs;
  const mainFile = context.resolveDestination('src/main.php');
  const line = `new Features\\${featureClass}(),`;
  const { contents, status } = registerFeatureInMain(await fs.readFile(mainFile, 'utf8'), featureClass);

  if (status === 'exists') {
    context.logger.info(`${featureClass} is already registered in src/main.php.`);
    return;
  }

  if (status === 'missing-marker') {
    context.logger.warn(`Could not find "// Add features here." in src/main.php. Add this line to the feature group yourself:\n\n\t${line}\n`);
    return;
  }

  if (context.dryRun) {
    context.logger.info(`Would register ${featureClass} in src/main.php.`);
    return;
  }

  await fs.writeFile(mainFile, contents);
  context.recordFile?.(mainFile, 'modified');
  context.logger.info(`Registered ${featureClass} in src/main.php.`);
};

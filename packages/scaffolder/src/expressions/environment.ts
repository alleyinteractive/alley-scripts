/* eslint-disable prefer-rest-params */

import Handlebars from 'handlebars';
import helpers from 'handlebars-helpers';

let env: typeof Handlebars | undefined;

/**
 * Get the configured Handlebars environment.
 */
export default function getEnvironment(): typeof Handlebars {
  if (env) {
    return env;
  }

  // Create a new Handlebars environment.
  env = Handlebars.create();

  // Register additional helpers.
  helpers(['array', 'comparison', 'math', 'object', 'string'], {
    handlebars: env,
  });

  /**
   * Split a value into a namespace and class name.
   */
  const splitFeatureName = (value: any) => {
    const parts = `${value}`.split('/');
    const className = parts.pop();

    return [parts.join('/') || '', className || ''];
  };

  const camelCaseString = (value: any, join: string = '_') => `${value}`.split(/[\s-]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(join);

  /**
   * Register a filter that covnerts a string to a dasherized string:
   *
   *   Example Feature -> example-feature
   *   example-feature -> example-feature
   *   Folder/Example Feature -> folder-example-feature
   */
  env.registerHelper(
    'dasherize',
    (value: any) => `${value}`.toLowerCase().replace(/[^a-z-0-9]/g, '-'),
  );

  /**
   * Register a filter that converts a string to a WordPress-style file name:
   *
   *    Example Feature -> class-example-feature.php
   *    Folder/Example Feature -> folder/class-example-feature.php
   *    example-feature -> class-example-feature.php
   */
  env.registerHelper(
    'wpClassFilename',
    (value: any, options: { hash: Record<string, string> }) => {
      const {
        hash: {
          prefix = 'class-',
          suffix = '.php',
        } = {},
      } = options;

      const [namespace, className] = splitFeatureName(value);

      return [
        ...namespace.split('/').map((part) => camelCaseString(part, '-').toLowerCase()),
        `${prefix}${camelCaseString(className, '-').toLowerCase()}${suffix}`,
      ].filter((part) => part !== '').join('/');
    },
  );

  /**
   * Register a filter that converts a string to a PSR-4 file name:
   *
   *   Example Feature -> ExampleFeature.php
   *   Folder/Example Feature -> Folder/ExampleFeature.php
   *   example-feature -> ExampleFeature.php
   */
  env.registerHelper(
    'psrClassFilename',
    (value: any, options: { hash: Record<string, string> }) => {
      const {
        hash: {
          prefix = '',
          suffix = '.php',
        } = {},
      } = options;

      const [namespace, className] = splitFeatureName(value);

      return [
        ...namespace.split('/').map((part) => camelCaseString(part, '')),
        `${prefix}${camelCaseString(className, '')}${suffix}`,
      ].filter((part) => part !== '').join('/');
    },
  );

  /**
   * Register a filter that converts a string to a WordPress-style class name.
   *
   *   example feature -> Example_Feature
   *   example-feature -> Example_Feature
   *   Folder/Example Feature -> Example_Feature
   */
  env.registerHelper(
    'wpClassName',
    (value: any, options: { hash: Record<string, string> }) => {
      const {
        hash: {
          prefix = '',
          suffix = '',
        } = {},
      } = options;

      return `${prefix}${camelCaseString(splitFeatureName(value)[1])}${suffix}`;
    },
  );

  /**
   * Register a filter that converts a string into a PSR-4 class name:
   *
   *   example-feature -> ExampleFeature
   *   Example Feature -> ExampleFeature
   *   Folder/Example Feature -> ExampleFeature
   */
  env.registerHelper(
    'psrClassName',
    (value: any, options: { hash: Record<string, string> }) => {
      const {
        hash: {
          prefix = '',
          suffix = '',
        } = {},
      } = options;

      return `${prefix}${camelCaseString(splitFeatureName(value)[1], '')}${suffix}`;
    },
  );

  /**
   * Register a filter that converts a string into a WordPress-style namespace:
   *
   *   example-feature -> ''
   *   Example Feature -> ''
   *   Folder/Example Feature -> Folder
   *   Folder/Sub Folder/Example Feature -> Folder\\Sub_Folder
   *
   * Supports a base namespace to be prepended to the namespace:
   *
   *   example-feature (with base namespace Feature) -> Feature
   *   Example Feature (with base namespace Feature) -> Feature
   *   Folder/Example Feature (with base namespace Feature) -> Feature\\Folder
   */
  env.registerHelper(
    'wpNamespace',
    (value: any, options: { hash: Record<string, string> }) => {
      const {
        hash: {
          prefix = '',
        } = {},
      } = options;

      const parts = splitFeatureName(value)[0].split('/').filter((part) => part !== '');

      if (prefix) {
        parts.unshift(prefix);
      }

      return parts.map((p) => camelCaseString(p)).join('\\');
    },
  );

  /**
   * Register a filter that converts a string into a PSR-4 namespace:
   *
   *   example-feature -> ExampleFeature
   *   Example Feature -> ExampleFeature
   *   Folder/Example Feature -> Folder\\ExampleFeature
   */
  env.registerHelper(
    'psrNamespace',
    (value: any, options: { hash: Record<string, string> }) => {
      const {
        hash: {
          prefix = '',
        } = {},
      } = options;

      const parts = splitFeatureName(value)[0].split('/').filter((part) => part !== '');

      if (prefix) {
        parts.unshift(prefix);
      }

      return parts.map((p) => camelCaseString(p, '')).join('\\');
    },
  );

  /**
   * Sanitize a string to be used as a folder name.
   *
   *   Example Feature -> example-feature
   *   example-feature -> example-feature
   *   Folder/Example Feature -> folder-example-feature
   */
  env.registerHelper(
    'folderName',
    (value: any) => `${value}`.toLowerCase().replace(/[^a-z-0-9]/g, '-'),
  );

  return env;
}

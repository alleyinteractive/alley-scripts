import nunjucks from 'nunjucks';

let env: nunjucks.Environment | null = null;

/**
 * Get the configured Nunjucks environment.
 */
export default function getEnvironment() {
  if (env) {
    return env;
  }

  // Configure nunjucks to use the same syntax as the GitHub Actions expression
  // and register out filters/custom functions.
  env = nunjucks.configure({
    autoescape: false,
    tags: {
      variableStart: '${{',
      variableEnd: '}}',
    },
    throwOnUndefined: true,
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

  // Register the custom filters for nunjucks to support WordPress development.

  /**
   * Register a filter that converts a string to a WordPress-style file name:
   *
   *    Example Feature -> class-example-feature.php
   *    Folder/Example Feature -> folder/class-example-feature.php
   *    example-feature -> class-example-feature.php
   */
  env.addFilter(
    'wpClassFilename',
    (value: any, prefix: string = 'class-', suffix: string = '.php') => {
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
  env.addFilter(
    'psrClassFilename',
    (value: any, prefix: string = '', suffix: string = '.php') => {
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
  env.addFilter(
    'wpClassName',
    (value: any, prefix: string = '', suffix: string = '') => `${prefix}${camelCaseString(splitFeatureName(value)[1])}${suffix}`,
  );

  /**
   * Register a filter that converts a string into a PSR-4 class name:
   *
   *   example-feature -> ExampleFeature
   *   Example Feature -> ExampleFeature
   *   Folder/Example Feature -> ExampleFeature
   */
  env.addFilter(
    'psrClassName',
    (value: any, prefix: string = '', suffix: string = '') => `${prefix}${camelCaseString(splitFeatureName(value)[1], '')}${suffix}`,
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
  env.addFilter(
    'wpNamespace',
    (value: any, baseNamespace: string = '') => {
      const parts = splitFeatureName(value)[0].split('/').filter((part) => part !== '');

      if (baseNamespace) {
        parts.unshift(baseNamespace);
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
  env.addFilter(
    'psrNamespace',
    (value: any, baseNamespace: string = '') => {
      const parts = splitFeatureName(value)[0].split('/').filter((part) => part !== '');

      if (baseNamespace) {
        parts.unshift(baseNamespace);
      }

      return parts.map((p) => camelCaseString(p, '')).join('\\');
    },
  );

  return env;
}

import nunjucks from 'nunjucks';

let env: nunjucks.Environment | null = null;

/**
 * Get the Nunjucks environment.
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

  // Register the custom filters for nunjucks to support WordPress development.

  /**
   * Register a filter that converts a string to a WordPress-style file name:
   *
   *    Example Feature -> example-feature
   */
  env.addFilter(
    'wpClassFilename',
    (value: any) => `${value}`.toLowerCase().replace(/\s+/g, '-'),
  );

  /**
   * Register a filter that converts a string to a WordPress-style class name.
   *
   *   example feature -> Example_Feature
   *   example-feature -> Example_Feature
   */
  env.addFilter(
    'wpClassName',
    (value: any) => `${value}`.split(/[\s-]/).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join('_'),
  );

  /**
   * Register a filter that converts a string into a PSR-4 class name:
   *
   *   example-feature -> ExampleFeature
   */
  env.addFilter(
    'psrClassName',
    (value: any) => `${value}`.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(''),
  );

  return env;
}

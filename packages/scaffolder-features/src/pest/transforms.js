export const MINIMUM_PHP = [8, 3];

const isBelowMinimum = (version) => {
  const [, major, minor] = `${version}`.match(/(\d+)\.(\d+)/) || [];

  if (major === undefined) {
    return false;
  }

  return Number(major) < MINIMUM_PHP[0]
    || (Number(major) === MINIMUM_PHP[0] && Number(minor) < MINIMUM_PHP[1]);
};

const minimumPhp = MINIMUM_PHP.join('.');

/**
 * Check whether a composer.json manifest already depends on Pest.
 */
export const usesPest = (composer) => {
  const packages = { ...composer.require, ...composer['require-dev'] };

  return 'pestphp/pest' in packages || 'alleyinteractive/pest-plugin-wordpress' in packages;
};

/**
 * Raise a Composer PHP constraint to the version Pest requires.
 */
export const raisePhpConstraint = (constraint) => (
  isBelowMinimum(constraint) ? `^${minimumPhp}` : constraint
);

/**
 * Point Composer scripts that ran PHPUnit at Pest instead.
 */
export const pestComposerScripts = (scripts = {}) => {
  const rewrite = (script) => {
    if (Array.isArray(script)) {
      return script.map(rewrite);
    }

    if (typeof script !== 'string') {
      return script;
    }

    return script
      .replace(/^@phpunit\b/, '@pest')
      .replace(/^(\S*\/)?phpunit\b/, '$1pest');
  };

  return Object.fromEntries(
    Object.entries(scripts).map(([name, script]) => [
      name === 'phpunit' ? 'pest' : name,
      rewrite(script),
    ]),
  );
};

/**
 * Raise the "Requires PHP" header of a plugin's main file.
 */
export const raiseRequiresPhpHeader = (contents) => contents.replace(
  /^(\s*\*?\s*Requires PHP:\s*)(\d+\.\d+(?:\.\d+)?)/m,
  (match, prefix, version) => (isBelowMinimum(version) ? `${prefix}${minimumPhp}` : match),
);

/**
 * Remove PHP versions below the minimum from inline GitHub Actions matrices.
 */
export const raiseWorkflowPhpMatrix = (contents) => contents.replace(
  /^(\s*php(?:-version)?:\s*\[)([^\]\n]*)(\])/gm,
  (match, prefix, list, suffix) => {
    const versions = list.split(',').map((item) => item.trim()).filter(Boolean);
    const kept = versions.filter((item) => !isBelowMinimum(item.replace(/['"]/g, '')));

    return kept.length && kept.length !== versions.length
      ? `${prefix}${kept.join(', ')}${suffix}`
      : match;
  },
);

/**
 * Raise the PHPCompatibility testVersion in a phpcs ruleset.
 */
export const raisePhpcsTestVersion = (contents) => contents.replace(
  /(name="testVersion"\s+value=")(\d+\.\d+)/,
  (match, prefix, version) => (isBelowMinimum(version) ? `${prefix}${minimumPhp}` : match),
);

/**
 * Find the fully-qualified class name of the project's base test case.
 */
export const testCaseClass = (composer) => {
  const psr4 = composer['autoload-dev']?.['psr-4'] || {};
  const entry = Object.entries(psr4).find(([, directory]) => (
    [directory].flat().some((item) => item.replace(/\/$/, '') === 'tests')
  ));

  return entry ? `${entry[0].replace(/\\$/, '')}\\TestCase` : null;
};

/**
 * Build the contents of tests/Pest.php.
 */
export const pestConfig = (packageTag, baseTestCase) => [
  '<?php',
  '/**',
  ' * Pest configuration',
  ' *',
  ` * @package ${packageTag}`,
  ' */',
  '',
  'declare(strict_types=1);',
  '',
  ...(baseTestCase
    ? [`pest()->extend( \\${baseTestCase}::class )->in( 'Feature' );`, '']
    : []),
].join('\n');

/**
 * Remove a per-file uses() call for the base test case added by Pest Drift.
 */
export const stripUsesTestCase = (contents, baseTestCase) => {
  const escaped = baseTestCase.replace(/\\/g, '\\\\');

  return contents.replace(new RegExp(`^uses\\(\\s*\\\\?${escaped}::class\\s*\\);\\n`, 'm'), '');
};

/**
 * Build the Pest version of the create-wordpress-plugin feature test stub.
 */
export const pestFeatureTestStub = (packageTag) => [
  '<?php',
  '/**',
  ' * {{ psr4ClassName inputs.featureName }} tests',
  ' *',
  ` * @package ${packageTag}`,
  ' */',
  '',
  "test( 'example', function () {",
  '\texpect( true )->toBeTrue();',
  '} );',
  '',
].join('\n');

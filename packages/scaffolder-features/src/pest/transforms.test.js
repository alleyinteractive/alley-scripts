import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  pestComposerScripts,
  pestConfig,
  raisePhpConstraint,
  raisePhpcsTestVersion,
  raiseRequiresPhpHeader,
  raiseWorkflowPhpMatrix,
  stripUsesTestCase,
  testCaseClass,
  usesPest,
} from './transforms.js';

describe('pest transforms', () => {
  it('detects projects that already use Pest', () => {
    assert.equal(usesPest({ 'require-dev': { 'pestphp/pest': '^4.0' } }), true);
    assert.equal(usesPest({ 'require-dev': { 'mantle-framework/testkit': '^1.15' } }), false);
    assert.equal(usesPest({}), false);
  });

  it('raises PHP constraints below 8.3', () => {
    assert.equal(raisePhpConstraint('^8.2'), '^8.3');
    assert.equal(raisePhpConstraint('>=7.4'), '^8.3');
    assert.equal(raisePhpConstraint('^8.3'), '^8.3');
    assert.equal(raisePhpConstraint('^8.4'), '^8.4');
  });

  it('points PHPUnit composer scripts at Pest', () => {
    assert.deepEqual(
      pestComposerScripts({
        lint: ['@phpcs'],
        phpunit: 'phpunit',
        test: ['@lint', '@phpunit'],
        filter: 'vendor/bin/phpunit --filter Example',
      }),
      {
        lint: ['@phpcs'],
        pest: 'pest',
        test: ['@lint', '@pest'],
        filter: 'vendor/bin/pest --filter Example',
      },
    );
  });

  it('raises the Requires PHP header', () => {
    assert.equal(raiseRequiresPhpHeader(' * Requires PHP: 8.2\n'), ' * Requires PHP: 8.3\n');
    assert.equal(raiseRequiresPhpHeader(' * Requires PHP: 8.4\n'), ' * Requires PHP: 8.4\n');
  });

  it('drops unsupported PHP versions from workflow matrices', () => {
    assert.equal(
      raiseWorkflowPhpMatrix('        php: [8.2, 8.3, 8.4, 8.5]\n'),
      '        php: [8.3, 8.4, 8.5]\n',
    );
    assert.equal(
      raiseWorkflowPhpMatrix("        php: ['8.1', '8.2', '8.3']\n"),
      "        php: ['8.3']\n",
    );
    assert.equal(raiseWorkflowPhpMatrix('        php: [8.2]\n'), '        php: [8.2]\n');
  });

  it('raises the phpcs testVersion', () => {
    assert.equal(
      raisePhpcsTestVersion('<config name="testVersion" value="8.2-"/>'),
      '<config name="testVersion" value="8.3-"/>',
    );
  });

  it('finds the base test case from autoload-dev', () => {
    assert.equal(
      testCaseClass({ 'autoload-dev': { 'psr-4': { 'Alley\\WP\\Plugin\\Tests\\': 'tests' } } }),
      'Alley\\WP\\Plugin\\Tests\\TestCase',
    );
    assert.equal(testCaseClass({}), null);
  });

  it('builds the Pest configuration', () => {
    const config = pestConfig('my-plugin', 'Alley\\WP\\Plugin\\Tests\\TestCase');

    assert.match(config, /@package my-plugin/);
    assert.match(config, /pest\(\)->extend\( \\Alley\\WP\\Plugin\\Tests\\TestCase::class \)->in\( 'Feature' \);/);
    assert.doesNotMatch(pestConfig('my-plugin', null), /extend/);
  });

  it('strips the uses() call Pest Drift adds for the base test case', () => {
    assert.equal(
      stripUsesTestCase(
        "<?php\n\nuses(\\Alley\\WP\\Plugin\\Tests\\TestCase::class);\ntest('example', function () {});\n",
        'Alley\\WP\\Plugin\\Tests\\TestCase',
      ),
      "<?php\n\ntest('example', function () {});\n",
    );
  });
});

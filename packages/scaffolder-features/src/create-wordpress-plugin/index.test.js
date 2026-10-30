import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { describe, it } from 'node:test';

import {
  classFilename,
  className,
  detectPlugin,
  lowercaseLabel,
  phpString,
  pluralize,
  registerFeatureInMain,
  validateSlug,
} from './index.js';

const mainPhp = `<?php
namespace Alley\\WP\\My_Plugin;

function main(): void {
	$plugin = new Group(
		new Features\\Load_Entries(),
		// Add features here.
	);
}
`;

describe('naming', () => {
  it('derives class and file names from a slug', () => {
    assert.equal(className('sn-theme', 'Post_Type'), 'Sn_Theme_Post_Type');
    assert.equal(className('editors_pick', 'Taxonomy'), 'Editors_Pick_Taxonomy');
    assert.equal(classFilename('Sn_Theme_Post_Type'), 'class-sn-theme-post-type.php');
  });

  it('pluralizes and lowercases labels', () => {
    assert.equal(pluralize('Book'), 'Books');
    assert.equal(pluralize('Story'), 'Stories');
    assert.equal(pluralize('Box'), 'Boxes');
    assert.equal(lowercaseLabel('Video Game'), 'video game');
    assert.equal(lowercaseLabel('FAQ iPhone Book'), 'FAQ iPhone book');
  });

  it('escapes PHP single-quoted strings', () => {
    assert.equal(phpString("Editor's \\ Pick"), "Editor\\'s \\\\ Pick");
  });

  it('validates slugs', () => {
    assert.doesNotThrow(() => validateSlug('book_type-2', 20, 'post type'));
    assert.throws(() => validateSlug('Book', 20, 'post type'), /lowercase/);
    assert.throws(() => validateSlug('a'.repeat(21), 20, 'post type'), /longer than 20/);
  });
});

describe('registerFeatureInMain', () => {
  it('inserts the feature above the marker', () => {
    const { contents, status } = registerFeatureInMain(mainPhp, 'Book_Post_Type');

    assert.equal(status, 'inserted');
    assert.match(contents, /\t\tnew Features\\Book_Post_Type\(\),\n\t\t\/\/ Add features here\./);
  });

  it('does not register a feature twice', () => {
    const { contents } = registerFeatureInMain(mainPhp, 'Book_Post_Type');

    assert.deepEqual(registerFeatureInMain(contents, 'Book_Post_Type'), { contents, status: 'exists' });
  });

  it('reports a missing marker', () => {
    const contents = mainPhp.replace('// Add features here.', '');

    assert.deepEqual(registerFeatureInMain(contents, 'Book_Post_Type'), { contents, status: 'missing-marker' });
  });
});

describe('detectPlugin', () => {
  it('reads the namespace and text domain', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cwp-'));
    await fs.mkdir(path.join(root, 'src'));
    await fs.writeFile(path.join(root, 'src', 'main.php'), mainPhp);
    await fs.writeFile(path.join(root, 'my-plugin.php'), '<?php\n/**\n * Plugin Name: My Plugin\n * Text Domain: my-plugin\n */\n');

    assert.deepEqual(await detectPlugin(root), {
      namespace: 'Alley\\WP\\My_Plugin',
      textDomain: 'my-plugin',
    });
  });

  it('fails outside a create-wordpress-plugin plugin', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'cwp-'));

    await assert.rejects(detectPlugin(root), /No src\/main\.php found/);
  });
});

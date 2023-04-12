#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import mustache from 'mustache';

// Internal functions.
import { directoryExists } from './src/validation.js';
import { toSnakeCase } from './src/formatting.js';
import { promptForEntryPoint } from './src/prompts.js';
import { hasArgInCLI } from './src/cli.js';
import {
  getInitialOptionForArg,
  getNameSpace,
  getTextDomain,
} from './src/options.js';

/**
 * __filename and __dirname are not available in ES Modules.
 * See: https://nodejs.org/api/esm.html#no-__filename-or-__dirname
 */
const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

// The path to the templates directory relative to the dist directory.
const TEMPLATE_PATH = path.join(dirName, '../templates');

/**
 * Prompts the user to select an entry point type.
 */
(async () => {
  // The directory where the entry points will be written
  // relative to the current working directory.
  const ENTRIES_DIR = getInitialOptionForArg(
    'entries',
    '--src-dir',
  );

  const {
    slug,
    hasStyles,
    hasEnqueue,
  } = await promptForEntryPoint();

  const entryType = hasArgInCLI('--slotfill') ? 'slotfill' : 'entry';

  // set the entry type and slug as environment variables.
  if (!entryType || !slug) {
    console.error('Invalid entry type or slug. Exiting...');
    process.exit(1);
  }

  if (!(await directoryExists(ENTRIES_DIR))) {
    await fs.promises.mkdir(ENTRIES_DIR);
  }

  // Navigate to the directory to create the entry point.
  process.chdir(ENTRIES_DIR);

  try {
    if (await directoryExists(slug)) {
      console.log(`Entry '${slug}' already exists! Choose a different slug. Exiting...`);
      process.exit(1);
    }

    const templateFiles = await glob('*.mustache', {
      cwd: path.join(TEMPLATE_PATH, entryType),
      dot: true,
    });

    if (templateFiles.length === 0) {
      console.log(`No templates found for ${entryType}. Exiting...`);
      process.exit(1);
    }

    // create the directory for the entry point.
    await fs.promises.mkdir(slug);

    const prefixNameSpace = await getNameSpace(hasEnqueue);
    const textdomain = getTextDomain();

    // Loop through the template files and render them with the provided data.
    await Promise.all(templateFiles.map(async (inputFile: string) => {
      const fileContents = await fs.promises.readFile(
        path.join(TEMPLATE_PATH, `${entryType}/${inputFile}`),
        'utf8',
      );

      // Render the Mustache templates.
      const render = mustache.render(fileContents, {
        slug,
        hasStyles,
        hasEnqueue,
        prefixNameSpace,
        nameSpaceSnakeCase: toSnakeCase(prefixNameSpace),
        slugUnderscore: toSnakeCase(slug),
        textdomain,
      }, { slug });

      if (render) {
        const outputFile = inputFile.replace(/\.mustache$/, '');

        try {
          // Write the output file.
          await fs.promises.writeFile(
            path.join(process.cwd(), slug, outputFile),
            render,
            'utf8',
          );
        } catch (error) {
          console.error(`Failed to create file '${ENTRIES_DIR}/${slug}/${outputFile}':`, error);
        }
      }
    }));

    console.log(`\nEntry '${slug}' was created successfully!`);
  } catch (error) {
    console.error(`Error creating entry '${slug}'`, error);
  }
})();

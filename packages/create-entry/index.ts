#!/usr/bin/env ts-node
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import glob from 'glob';
import mustache from 'mustache';

// Internal functions.
import directoryExists from './src/directoryExists';
import toUnderscore from './src/toUnderscore';

import { promptForEntryPoint, promptForNamespace } from './src/prompts';

// The directory where the entry points will be written relative to the current working directory.
const ENTRIES_DIR = 'entries';

/**
 * Prompts the user to select an entry point type.
 */
(async () => {
  const {
    entryType,
    slug,
    hasStyles,
    hasEnqueue,
  } = await promptForEntryPoint();

  // set the entry type and slug as environment variables.
  if (!entryType || !slug) {
    console.error('Invalid entry type or slug. Exiting...');
    process.exit(1);
  }

  const prefixNameSpace = promptForNamespace(hasEnqueue);

  if (!(await directoryExists(ENTRIES_DIR))) {
    await fs.promises.mkdir(ENTRIES_DIR);
    console.log(`Directory '${ENTRIES_DIR}' created successfully!`);
  }

  // Navigate to the directory to create the entry point.
  process.chdir(ENTRIES_DIR);

  try {
    if (await directoryExists(slug)) {
      console.log(`Entry '${slug}' already exists! Choose a different slug. Exiting...`);
      process.exit(1);
    }

    const templateFiles = await glob('*.mustache', {
      cwd: path.join(__dirname, `templates/${entryType}`),
      dot: true,
    });

    if (templateFiles.length === 0) {
      console.log(`No templates found for ${entryType}. Exiting...`);
      process.exit(1);
    }

    // create the directory for the entry point.
    await fs.promises.mkdir(slug);

    // Loop through the template files and render them with the provided data.
    await Promise.all(templateFiles.map(async (inputFile: string) => {
      const fileContents = await fs.promises.readFile(
        path.join(__dirname, `templates/${entryType}/${inputFile}`),
        'utf8',
      );

      // Render the Mustache templates.
      const render = mustache.render(fileContents, {
        slug,
        hasStyles,
        hasEnqueue,
        prefixNameSpace,
        slugUnderscore: toUnderscore(slug),
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

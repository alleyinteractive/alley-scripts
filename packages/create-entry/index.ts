#!/usr/bin/env node
/* eslint-disable no-console */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import chalk from 'chalk';
import mustache from 'mustache';

// Internal functions.
import {
  directoryExists,
  validateCLIargs,
} from './src/validation.js';
import { toSnakeCase } from './src/formatting.js';
import {
  promptForSlug,
  promptForEntryPoint,
  promptForEnqueueHook,
  promptForEnqueueStyleHook,
} from './src/prompts.js';
import entryArgs from './src/entryArgs.js';
import {
  getNameSpace,
  getTextDomain,
  getEntryType,
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
 * Prompts the user to create an entry point.
 */
(async () => {
  let enqueueHook = '';
  let enqueueStyleHook = '';

  // Validate the CLI args if they exist first so that a user can fix flags if they are invalid.
  validateCLIargs(
    ['src-dir', 'namespace', 'textdomain'],
    entryArgs,
  );

  /**
   * Get the source directory argument passed to the CLI if there is one.
   * If not use the default 'entries'. This is where the entry points will
   * be written to relative to the current working directory.
   */
  const {
    'src-dir': srcDir = 'entries',
  } = entryArgs;

  try {
    // Create the source directory for the entry points.
    if (!(await directoryExists(srcDir))) {
      await fs.promises.mkdir(srcDir);
    }

    // Navigate to the directory to create the entry point.
    process.chdir(srcDir);

    // The entry type. Either 'entry' or 'slotfill'.
    const entryType = getEntryType();

    // Prompt for the slug. Will exit if no slug is provided.
    const slug = await promptForSlug();

    const {
      hasStyles,
      hasEnqueue,
    } = await promptForEntryPoint();

    const templateFiles: string[] = await glob('*.mustache', {
      cwd: path.join(TEMPLATE_PATH, entryType),
      dot: true,
    });

    if (templateFiles.length === 0) {
      throw new Error(
        chalk.red(
          `No entry templates were found for ${chalk.red.bold(entryType)}. Exiting...`,
        ),
      );
    }

    // Call these functions here so that the prompts called and the data is defined.
    const prefixNameSpace = await getNameSpace(hasEnqueue);

    if (entryType !== 'slotfill') {
      // If there is an enqueue file, prompt for the enqueue hook names and set the hook names.
      enqueueHook = hasEnqueue ? await promptForEnqueueHook() : '';
      enqueueStyleHook = hasEnqueue && hasStyles
        ? await promptForEnqueueStyleHook() : '';
    }

    // Create the directory for the entry point.
    await fs.promises.mkdir(slug);

    // Output files used to display the files generated for the entry.
    let outputFiles: string[] = [];

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
        enqueueHook,
        enqueueStyleHook,
        prefixNameSpace,
        nameSpaceSnakeCase: toSnakeCase(prefixNameSpace),
        slugUnderscore: toSnakeCase(slug),
        textdomain: getTextDomain(),
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
          // Add the output file to the list.
          outputFiles = [...outputFiles, outputFile];
        } catch (error) {
          console.error(
            chalk.red(
              `Failed to create file '${srcDir}/${slug}/${outputFile}':\n`,
            ),
            error,
          );
        }
      }
    }));

    // Output the success message.
    console.log(
      chalk.green(
        `\nThe ${entryType} "${chalk.cyan(slug)}" was successfully created in the "${chalk.cyan(srcDir)}" directory with the following files:`,
      ),
    );
    // Print each file generated to the console.
    outputFiles.forEach((file) => console.log(` - ${chalk.cyan(file)}`));
  } catch (error) {
    console.error(chalk.red('Error creating entry.'), error);
  }
})();

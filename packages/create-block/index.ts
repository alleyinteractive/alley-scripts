#!/usr/bin/env node

import { chdir, cwd } from 'node:process';
import { spawn } from 'node:child_process';

/* eslint-disable no-console */
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import commandLineArgs, { OptionDefinition } from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import setupEnvironmentVariables from './src/setup-environment-variables';

type Options = {
  name: string;
  alias?: string;
  type: StringConstructor | BooleanConstructor;
  defaultValue?: any;
  defaultOption?: string;
  description: string;
};

/**
 * Define the command line options.
 */
const options: Options[] = [
  {
    name: 'namespace',
    alias: 'n',
    type: String,
    defaultValue: 'create-block',
    defaultOption: 'create-block',
    description: 'The namespace for the block. (default: create-block)',
  },
  {
    name: 'blocksDir',
    alias: 'b',
    description: 'The directory where the blocks will be created relative to the current working directory. (default: blocks)',
    type: String,
    defaultValue: 'blocks',
    defaultOption: 'blocks',
  },
  {
    name: 'blockLanguage',
    alias: 'l',
    description: 'The language for the block. Accepts `typescript` or `javascript`',
    type: String,
  },
  {
    name: 'hasViewScript',
    alias: 'v',
    description: 'Whether the block will have a frontend scripts definition. (viewScript in block.json)',
    type: Boolean,
  },
  {
    name: 'skipRegistration',
    alias: 'r',
    description: 'Specifies whether the block should skip registration in PHP.',
    type: Boolean,
  },
  {
    name: 'help',
    alias: 'h',
    description: 'Display this usage guide.',
    type: Boolean,
  },
];

// Get the options from the command line.
const {
  namespace,
  blocksDir: blocksDirectory,
  blockLanguage,
  hasViewScript,
  skipRegistration: shouldRegisterBlock,
  help,
} = commandLineArgs(options as OptionDefinition[]);

// Display the help text if the --help option is used.
const usage = commandLineUsage([
  {
    header: 'Alley Create Block',
    content: 'Alley Create Block is an external template for @wordpress/create-block with set configurations defined for scaffolding a dynamic WordPress block into an existing project that uses WP Scripts (@wordpress/scripts).',
  },
  {
    header: 'Options',
    optionList: options as OptionDefinition[],
  },
]);

// Display the help text if the --help option is used.
if (help) {
  console.log(usage);
  process.exit(0);
}

console.log(`🚀 ${chalk.underline(chalk.bold.green('@alleyinteractive/create-block'))} 🚀\n`);

/**
 * Prompts the user to select a block language (TypeScript or JavaScript)
 * and then create a block using the @wordpress/create-block package.
 */
(async () => {
  await setupEnvironmentVariables({ blockLanguage, hasViewScript, shouldRegisterBlock });

  // Assign the namespace as an environment variable if there is one.
  process.env.namespace = namespace;

  // Create the directory if it doesn't exist.
  if (!fs.existsSync(blocksDirectory)) {
    try {
      fs.mkdirSync(blocksDirectory);
      console.log(`Directory '${blocksDirectory}' created successfully!\n`);
    } catch (error: any) {
      console.error(`Failed to create directory '${blocksDirectory}'`, error);
      process.exit(1); // Exit the script with an error status code
    }
  }

  // Navigate to the directory to create the block.
  try {
    chdir(blocksDirectory);
  } catch (err) {
    console.error(`chdir: ${err}`);
  }

  // Create a block using the @wordpress/create-block package.
  spawn(
    'wp-create-block',
    [
      /**
       * This argument specifies an external npm package as a template.
       * In this case, the select-templates.js file is used as a the entry for the template.
       * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#template
       */
      '--template',
      path.join(__dirname, 'src/select-templates.js'),
      /**
       * With this argument, the create-block package runs in
       * "No plugin mode" which only scaffolds block files into the current directory.
       * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#no-plugin
       */
      '--no-plugin',
      /**
       * Set the block variant as dynamic, the only variant that is supported in this script
       * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#variant
       */
      '--variant',
      'dynamic',
    ],
    {
      cwd: cwd(),
      stdio: 'inherit',
    },
  ).on('exit', (code, signal) => {
    if (signal) {
      process.exit(1);
    } else {
      process.exit(code ?? 0);
    }
  });
})();

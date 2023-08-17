#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs');
const prompts = require('prompts');
const path = require('path');
const spawn = require('cross-spawn');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

type Options = {
  name: string;
  alias?: string;
  type: StringConstructor | BooleanConstructor;
  defaultValue?: string;
  defaultOption?: string;
  description: string;
};

type LanguageType = 'typescript' | 'javascript';

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
    name: 'help',
    alias: 'h',
    description: 'Display this usage guide.',
    type: Boolean,
  },
];

/**
 * Validate the block language.
 *
 * @param value - The block language.
 * @return      - The block language if it is valid.
 *
 * @throws {Error} If the block language is not one of the accepted values.
 */
function validateBlockLanguage(value: string) {
  if (value !== 'typescript' && value !== 'javascript') {
    throw new Error('The block language must be one of \'typescript\' or \'javascript\'\n');
  }
  return value;
}

// Get the options from the command line.
const {
  namespace,
  blocksDir: blocksDirectory,
  blockLanguage,
  help,
} : {
  namespace: string;
  blocksDir: string;
  blockLanguage: LanguageType | undefined;
  help: boolean;
} = commandLineArgs(options);

// Display the help text if the --help option is used.
const usage = commandLineUsage([
  {
    header: 'Alley Create Block',
    content: 'Alley Create Block is an external template for @wordpress/create-block with set configurations defined for scaffolding a dynamic WordPress block into an existing project that uses WP Scripts (@wordpress/scripts).',
  },
  {
    header: 'Options',
    optionList: options,
  },
]);

// Display the help text if the --help option is used.
if (help) {
  console.log(usage);
  process.exit(0);
}

/**
 * Prompts the user to select a block language (TypeScript or JavaScript)
 * and then create a block using the @wordpress/create-block package.
 */
(async () => {
  // If there is no command line argument for the block language,
  // allow the user to select one with a prompt.
  if (!blockLanguage) {
    const { blockLanguagePrompt }: {
      blockLanguagePrompt: LanguageType;
    } = await prompts({
      type: 'select',
      name: 'blockLanguagePrompt',
      message: 'Create a block in TypeScript or JavaScript?',
      choices: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'JavaScript', value: 'javascript' },
      ],
      initial: 0,
    });
    process.env.blockLanguage = validateBlockLanguage(blockLanguagePrompt);
  } else {
    process.env.blockLanguage = validateBlockLanguage(blockLanguage);
  }

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
  process.chdir(blocksDirectory);

  // Create a block using the @wordpress/create-block package.
  spawn.sync(
    'npx',
    [
      '@wordpress/create-block',
      /**
       * This argument specifies an external npm package as a template.
       * In this case, the selectTemplates.js file is used as a the entry for the template.
       * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#template
       */
      '--template',
      path.join(__dirname, 'src/selectTemplates.js'),
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
    { stdio: 'inherit' },
  );
})();

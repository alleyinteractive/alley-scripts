#!/usr/bin/env node
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
    description: 'The language for the block. Accepts `typescript` or `javascript`. (default: typescript)',
    type: String,
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
    content: 'Alley Create Block is an external template for @wordpress/create-block with set configurations defined for scaffolding a WordPress block into an existing project that uses WP Scripts (@wordpress/scripts).',
  },
  {
    header: 'Options',
    optionList: options,
  },
]);

// Display the help text if the --help option is used.
if (help) {
  // eslint-disable-next-line no-console
  console.log(usage);
  process.exit(1);
}

// Create the directory if it doesn't exist.
if (!fs.existsSync(blocksDirectory)) {
  fs.mkdirSync(blocksDirectory);
  // eslint-disable-next-line no-console
  console.log(`Directory '${blocksDirectory}' created successfully!\n`);
  // Navigate to the directory to create the block.
  process.chdir(blocksDirectory);
} else {
  process.chdir(blocksDirectory);
}

/**
 * Prompts the user to select a block language (TypeScript or JavaScript)
 * and then create a block using the @wordpress/create-block package.
 */
(async () => {
  let language: LanguageType | null = 'typescript';

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
    language = blockLanguagePrompt;
  } else {
    language = blockLanguage;
  }

  // Assign the namespace as an environment variable if there is one.
  process.env.namespace = namespace;

  if (language) {
    // Set the block language as an environment variable
    // so it can be used in the selectTemplates.js file.
    process.env.blockLanguage = language;

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
      ],
      { stdio: 'inherit' },
    );
  } else {
    process.exit(1);
  }
})();

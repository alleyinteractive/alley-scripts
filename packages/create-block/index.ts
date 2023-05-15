#!/usr/bin/env node
const fs = require('fs');
const prompts = require('prompts');
// @ts-ignore
const path = require('path');
const spawn = require('cross-spawn');
const commandLineArgs = require("command-line-args");
const commandLineUsage = require('command-line-usage');

/**
 * Define the command line options.
 */
const options = [
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
    name: 'help',
    alias: 'h',
    description: 'Display this usage guide.',
    type: Boolean,
  }
];

// Get the options from the command line.
const {
  namespace,
  blocksDir: blocksDirectory,
  help,
} = commandLineArgs(options);

// Display the help text if the --help option is used.
const usage = commandLineUsage([
  {
    header: 'Alley Create Block',
    content: 'Alley Create Block is a wrapper for @wordpress/create-block with set configurations defined for scaffolding a WordPress block into an existing project that uses WP Scripts (@wordpress/scripts).'
  },
  {
    header: 'Options',
    optionList: options
  }
]);

if (help) {
  // Display the help text.
  console.log(usage);
  process.exit(1);
}

// Create the directory if it doesn't exist.
if (!fs.existsSync(blocksDirectory)) {
  fs.mkdirSync(blocksDirectory);
  // eslint-disable-next-line no-console
  console.log(`Directory '${blocksDirectory}' created successfully!`);
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
  const response = await prompts({
    type: 'select',
    name: 'blockLanguage',
    message: 'Create a block in TypeScript or JavaScript?',
    choices: [
      { title: 'TypeScript', value: 'typescript' },
      { title: 'JavaScript', value: 'javascript' },
    ],
    initial: 0,
  });

  const language = response?.blockLanguage || null;

  if (language) {
    // Set the block language as an environment variable
    // so it can be used in the selectTemplates.js file.
    process.env.blockLanguage = language;

    // Create a block using the @wordpress/create-block package.
    spawn.sync(
      'npx',
      [
        '@wordpress/create-block',
        '--namespace',
        namespace,
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

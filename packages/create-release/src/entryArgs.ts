import { parse } from 'ts-command-line-args';

/**
 * The command line argument types.
 */
export type EntryArgs = {
  version?: string;
  major?: boolean;
  minor?: boolean;
  patch?: boolean;
  'dry-run'?: boolean;
  help?: boolean;
};

/**
 * Set the script arguments and defaults.
 */
const entryArgs = parse<EntryArgs>(
  {
    version: {
      type: String,
      alias: 'v',
      description: 'The version number to set for the release.',
      optional: true,
    },
    major: {
      type: Boolean,
      description: 'Increment the major version number.',
      optional: true,
    },
    minor: {
      type: Boolean,
      description: 'Increment the minor version number.',
      optional: true,
    },
    patch: {
      type: Boolean,
      description: 'Increment the patch version number.',
      optional: true,
    },
    'dry-run': {
      type: Boolean,
      description: 'Run the script without making any changes.',
      optional: true,
    },
    help: {
      type: Boolean,
      optional: true,
      alias: 'h',
      description: 'Prints this usage guide',
    },
  },
  {
    helpArg: 'help',
    headerContentSections: [{
      header: 'Alley Create Release',
      content: 'Create alleyinteractive/create-wordpress-plugin releases with ease.',
    }],
  },
);

export default entryArgs;

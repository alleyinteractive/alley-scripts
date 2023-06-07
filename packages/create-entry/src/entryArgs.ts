import { parse } from 'ts-command-line-args';

/**
 * The command line argument types.
 */
export type EntryArgs = {
  'src-dir'?: string;
  help?: boolean;
  namespace?: string;
  slotfill?: boolean;
  textdomain?: string;
};

/**
 * Set the script arguments and defaults.
 */
const entryArgs = parse<EntryArgs>(
  {
    'src-dir': {
      type: String,
      description: 'The directory where the entry points will be written relative to the current working directory. (default is "entries")',
      optional: true,
    },
    help: {
      type: Boolean,
      optional: true,
      alias: 'h',
      description: 'Prints this usage guide',
    },
    namespace: {
      type: String,
      alias: 'n',
      description: 'Internal namespace for the entry point. (default is "create-entry")',
      optional: true,
    },
    slotfill: {
      type: Boolean,
      alias: 's',
      description: 'Text domain for setting translated strings for a script. (default is empty or "default")',
      optional: true,
    },
    textdomain: {
      type: String,
      alias: 't',
      description: 'Text domain for setting translated strings for a script. (default is empty or "default")',
      optional: true,
    },
  },
  {
    helpArg: 'help',
    headerContentSections: [{
      header: 'Alley Create Entry',
      content: 'Alley\'s create entry point script is a tool to scaffold entry points and slotfills for projects that use @wordpress/scripts for a projects build system.',
    }],
  },
);

export default entryArgs;

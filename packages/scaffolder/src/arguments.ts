import { parse } from 'ts-command-line-args';

/**
 * The command line argument types.
 */
export type Arguments = {
  root?: string;
  debug?: boolean;
  'dry-run'?: boolean;
  help?: boolean;
};

/**
 * Set the script arguments and defaults.
 */
const commandArguments = parse<Arguments>(
  {
    root: {
      type: String,
      description: 'The root directory of the project. Defaults to the current working directory.',
      optional: true,
    },
    debug: {
      type: Boolean,
      description: 'Enable debug logging.',
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
      header: 'Alley Scaffolder',
      content: 'Scaffold templates for your projects and work faster.',
    }],
    partial: true,
    processExitCode: 1,
    stopAtFirstUnknown: true,
  },
);

export default commandArguments;

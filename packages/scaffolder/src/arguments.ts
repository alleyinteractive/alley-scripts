import { parse } from 'ts-command-line-args';

/**
 * The command line argument types.
 */
export type Arguments = {
  root?: string;
  debug?: boolean;
  'dry-run'?: boolean;
  help?: boolean;
  list?: boolean;
  input?: string[];
  inputs?: string;
  'non-interactive'?: boolean;
  describe?: boolean;
  json?: boolean;
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
    list: {
      alias: 'l',
      type: Boolean,
      description: 'List available features.',
      optional: true,
    },
    input: {
      type: String,
      multiple: true,
      description: 'Set a feature input as key=value. Can be repeated.',
      optional: true,
    },
    inputs: {
      type: String,
      description: 'Set feature inputs as a JSON object.',
      optional: true,
    },
    'non-interactive': {
      type: Boolean,
      description: 'Never prompt. Missing required inputs cause an error. Enabled automatically when stdin is not a TTY.',
      optional: true,
    },
    describe: {
      type: Boolean,
      description: 'Print the selected feature and its inputs as JSON.',
      optional: true,
    },
    json: {
      type: Boolean,
      description: 'Print machine-readable JSON to stdout and send logs to stderr.',
      optional: true,
    },
  },
  {
    helpArg: 'help',
    headerContentSections: [{
      header: 'Alley Scaffolder',
      content: 'Scaffold templates for your projects and work faster.',
    }],
    footerContentSections: [{
      header: 'Examples',
      content: [
        'scaffolder <feature>',
        'scaffolder <feature> --describe',
        'scaffolder <feature> --non-interactive --input name=value --input other=value',
        'scaffolder --list --json',
      ].join('\n'),
    }],
    partial: true,
    processExitCode: 1,
  },
);

export default commandArguments;

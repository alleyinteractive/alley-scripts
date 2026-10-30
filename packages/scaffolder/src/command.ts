import chalk from 'chalk';

import { getFeatureStore, initializeFeatureStore } from './features/store';
import { initializeLogger } from './logger';
import { featureToGenerator, promptUserForFeature } from './features';
import commandArguments from './arguments';
import { initializeConfigurationStore } from './configuration';
import handleError from './error';
import { parseInputArguments } from './inputs';
import type { InputValues } from './inputs';

/**
 * Flatten an error and its causes into one message.
 */
const errorMessage = (error: unknown): string => {
  const messages: string[] = [];
  let current: unknown = error;

  while (current instanceof Error) {
    messages.push(current.message);
    current = current.cause;
  }

  return messages.join('\n') || String(error);
};

const writeJson = (value: unknown) => {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
};

class ScaffolderCommand {
  private readonly arguments: typeof commandArguments & { _unknown?: string[] };

  private logger: ReturnType<typeof initializeLogger>;

  private readonly machineOutput: boolean;

  public constructor() {
    this.arguments = commandArguments;

    const {
      debug = false,
      describe = false,
      json = false,
      root = false,
    } = this.arguments;

    this.machineOutput = json || describe;
    this.logger = initializeLogger(debug || false, this.machineOutput);

    // Load all configuration files cascading up from the current working directory.
    initializeConfigurationStore(root || process.cwd());
  }

  async invoke() {
    const {
      'dry-run': dryRun = false,
      'non-interactive': nonInteractive = false,
      describe = false,
      input = [],
      inputs: inputsJson = undefined,
      json = false,
      list = false,
      _unknown: argv = [],
    } = this.arguments;

    const unknownFlags = argv.filter((arg) => arg.startsWith('-'));
    const [featureName, ...extraArguments] = argv.filter((arg) => !arg.startsWith('-'));

    if (unknownFlags.length) {
      handleError(`🚨 Unknown argument(s): ${unknownFlags.join(', ')}. Run "scaffolder --help" for usage.`);
    }

    if (extraArguments.length) {
      handleError(`🚨 Unexpected argument(s): ${extraArguments.join(', ')}. Pass feature inputs with --input key=value.`);
    }

    const interactive = !nonInteractive && !describe && Boolean(process.stdin.isTTY);

    let providedInputs: InputValues = {};

    try {
      providedInputs = parseInputArguments(input, inputsJson);
    } catch (error) {
      handleError(errorMessage(error));
    }

    if (!this.machineOutput) {
      this.welcome();
    }

    await initializeFeatureStore();

    if (list) {
      const features = Object.values(getFeatureStore().all()).flat();

      if (json) {
        writeJson(features.map(({ name, description = null }) => ({ name, description })));
      } else {
        this.logger.info('Available features:');

        features.forEach((feature) => {
          this.logger.info(`- ${chalk.green(feature.name)}: ${feature.description || 'No description available'}`);
        });
      }

      process.exit(0);
    }

    const generator = featureToGenerator(...await promptUserForFeature(featureName, interactive));

    if (describe) {
      const definitions = await generator.describeInputs();

      writeJson({
        name: generator.config.name,
        description: generator.config.description || null,
        type: generator.config.type || 'file',
        inputs: definitions.map((definition) => ({
          name: definition.name,
          type: definition.type,
          required: definition.required && definition.default === undefined,
          default: definition.default ?? null,
          description: definition.description || null,
        })),
      });

      return;
    }

    try {
      await generator.resolveAndInvoke({ dryRun, interactive, providedInputs });
    } catch (error) {
      handleError(errorMessage(error));
    }

    if (json) {
      writeJson({
        feature: generator.config.name,
        dryRun,
        inputs: generator.inputs,
        files: generator.files.map((file) => ({
          ...file,
          path: file.path.startsWith(`${process.cwd()}/`) ? file.path.slice(process.cwd().length + 1) : file.path,
        })),
      });
    }

    this.logger.info('🎉 Done. Happy coding!');
  }

  private welcome() {
    const emojis = ['👋', '🌸', '🚀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    this.logger.info(`${randomEmoji} Welcome to ${chalk.magenta('@alleyinteractive/scaffolder')}!`);

    const { 'dry-run': dryRun = false } = this.arguments;

    if (dryRun) {
      this.logger.info('🚨 Running in dry-run mode. No files will be generated.');
    }
  }
}

export { ScaffolderCommand };

import { initializeFeatureStore } from './features/store';
import { initializeLogger } from './logger';
import { configToGenerator, promptUserForFeature } from './features';
import commandArguments from './arguments';
import { initializeConfigurationStore } from './configuration';

class ScaffolderCommand {
  private readonly arguments: typeof commandArguments & { _unknown?: string[] };

  private logger: ReturnType<typeof initializeLogger>;

  public constructor() {
    this.arguments = commandArguments;

    const {
      debug = false,
      root = process.cwd(),
    } = this.arguments;

    this.logger = initializeLogger(debug || false);

    // Load all configuration files cascading up from the current working directory.
    initializeConfigurationStore(root || process.cwd());
  }

  async invoke() {
    const {
      'dry-run': dryRun = false,
      _unknown: argv = undefined,
    } = this.arguments;

    this.welcome();

    await initializeFeatureStore();

    const feature = await promptUserForFeature(argv ? argv[0] : undefined);

    await configToGenerator(...feature).resolveAndInvoke(dryRun);

    this.logger.info('🎉 Done. Happy coding!');
  }

  private welcome() {
    const emojis = ['👋', '🌸', '🚀'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    this.logger.info(`${randomEmoji} Welcome to @alleyinteractive/scaffolder!`);

    const { 'dry-run': dryRun = false } = this.arguments;

    if (dryRun) {
      this.logger.info('🚨 Running in dry-run mode. No files will be generated.');
    }
  }
}

export { ScaffolderCommand };

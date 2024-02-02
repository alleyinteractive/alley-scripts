import { initializeFeatureStore } from './features/store';
import { logger } from './logger';
import { configToGenerator, invokeFeature, promptUserForFeature } from './features';

const welcome = (dryRun: boolean) => {
  const emojis = ['👋', '🌸', '🚀'];
  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  logger().info(`${randomEmoji} Welcome to @alleyinteractive/scaffolder!`);

  if (dryRun) {
    logger().info('🚨 Running in dry-run mode. No files will be generated.');
  }
};

/**
 * Run the scaffolder with the provided arguments.
 */
export const run = async (argv: string[] | undefined, dryRun = false) => {
  welcome(dryRun);

  await initializeFeatureStore();

  const feature = await promptUserForFeature(argv ? argv[0] : undefined);

  return invokeFeature(configToGenerator(...feature), dryRun);
};

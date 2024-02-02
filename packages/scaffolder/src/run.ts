import { initializeFeatureStore } from './features/store';
import { getFeatures } from './discovery';
import handleError from './error';
import { logger } from './logger';
// import { getConfigurationStore } from '.';
// import resolveFeature from './resolveFeature';

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

  const store = initializeFeatureStore();

  throw new Error('asdad');

  const features = await getFeatures();

  if (!features.length) {
    handleError('No features found to scaffold.\n\nEnsure that your configuration isn\'t inadvertently overriding the built-in sources included with the scaffolder.');
  }

  logger().debug(`Found ${features.length} features to scaffold: ${JSON.stringify(features, null, 2)}`);

  // const feature = await resolveFeature(features, argv ? argv[0] : undefined);

  // return feature.resolveAndInvoke(dryRun);
};

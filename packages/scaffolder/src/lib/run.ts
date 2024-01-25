import { dirname } from 'path';
import { glob } from 'fast-glob';
import chalk from 'chalk';
import fs from 'fs';

import { parseExpression, parseFalsy, parseObjectExpression } from './expressions';
import collectInputs from './inputs';
import handleError from './error';
import { logger } from './logger';

import type { Feature, FeatureContext, FeatureFile } from '../types';

/**
 * Collect the context variables passed to the template engine.
 */
const collectContextVariables = async (feature: Feature) => {
  const {
    config: {
      name,
      inputs: featureInputs = [],
    },
    path: featurePath,
  } = feature;

  return {
    feature: {
      name,
      path: featurePath,
    },
    inputs: await collectInputs(featureInputs),
  } as FeatureContext;
};

/**
 * Collect the feature source files and parse the expressions.
 *
 * Compiles all the expressions from the configuration and returns the list of
 * source files that should be generated for a feature.
 */
const collectFeatureSourceFiles = (rootDir: string, feature: Feature, context: FeatureContext): FeatureFile[] => { // eslint-disable-line max-len
  const {
    config: {
      name: featureName,
      files: featureFiles = [],
    },
    path: featurePath,
  } = feature;

  logger().debug(`Collecting source files for ${chalk.yellow(featureName)}`);

  return featureFiles
    // Parse the expression of any file attribute.
    .map((file) => parseObjectExpression({
      ...file,
      // Ensure that destination/source directories are prefixed with the
      // feature/root directories, respectively, to allow the configuration to
      // be relative from the config file.
      destination: `${rootDir}/${file.destination}`,
      source: `${featurePath}/${file.source}`,
    }, context))
    // Check if the already-parsed condition is not falsy.
    .filter(({ if: condition = null }) => condition === null || !parseFalsy(condition))
    // Expand any directories into their files that match the glob pattern.
    .flatMap((file) => {
      const { destination, source } = file;

      // If the source is a file and it exists, return the file.
      if (fs.existsSync(source) && fs.statSync(source).isFile()) {
        return file;
      }

      // Find all files that match the glob pattern.
      const matchedFiles = glob.sync(source, {
        absolute: true,
        cwd: featurePath,
      });

      // Warn the user if no files were found.
      if (!matchedFiles.length) {
        logger().warn(`No files found against "${chalk.yellow(source)}" for "${chalk.yellow(featureName)}".`);
        return file;
      }

      return matchedFiles.map((matchedFile) => ({
        destination: `${destination.replace(/\/$/, '')}/${matchedFile.replace(featurePath, '').replace(/^\//, '')}`,
        source: matchedFile,
      }));
    })
    // Filter out any files that already exist.
    .filter(({ destination: destinationPath }) => {
      if (fs.existsSync(destinationPath)) {
        logger().error(`Destination file already exists: ${destinationPath}. Skipping.`);

        return false;
      }

      return true;
    });
};

/**
 * Process a feature and scaffold the files.
 */
export default async function processFeature(rootDir: string, feature: Feature, dryRun: boolean) {
  const {
    config: { name: featureName },
  } = feature;

  logger().debug(`Processing feature ${chalk.yellow(featureName)}`);

  const context = await collectContextVariables(feature);
  const files = collectFeatureSourceFiles(rootDir, feature, context);

  logger().debug(`Found ${files.length} files to generate`);

  if (!files.length) {
    handleError(`No files to generate for the feature ${featureName}`);
  }

  // Run each file through the expression parser and write the file to their new
  // file destination.
  files.forEach(async ({ destination, source }) => {
    let contents: string;
    let generatedFile: string;

    try {
      contents = fs.readFileSync(source, 'utf8');
    } catch (error: any) {
      handleError(`Error reading from ${chalk.yellow(source)}: ${chalk.white(error.message || '')}`);
    }

    try {
      generatedFile = parseExpression(contents, context);
    } catch (error: any) {
      handleError(`Error generating template from ${chalk.yellow(source)}: ${chalk.white(error.message || '')}`);
    }

    try {
      const destinationDir = dirname(destination);

      // Ensure that the directory exists.
      if (!fs.existsSync(destinationDir) && !dryRun) {
        fs.mkdirSync(destinationDir, { recursive: true });
      }
    } catch (error: any) {
      handleError(`Error creating directory for ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
    }

    try {
      if (!dryRun) {
        fs.writeFileSync(destination, generatedFile);

        logger().info(`${chalk.greenBright('✔')} Generated ${chalk.green(destination.replace(rootDir, '').replace(/^\//, ''))}`);
      } else {
        logger().info(`Would generate ${chalk.green(destination.replace(rootDir, '').replace(/^\//, ''))}`);
      }
    } catch (error: any) {
      handleError(`Error writing from ${chalk.yellow(source)} to ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
    }
  });
}

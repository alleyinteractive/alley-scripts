/* eslint-disable no-console */

import chalk from 'chalk';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from 'fs';
import { dirname } from 'path';

import { parseExpression, parseFalsy, parseObjectExpression } from './expressions/index.js';
import collectInputs from './inputs.js';
import handleError from './error.js';

import type { Feature } from './types.js';

type FeatureContext = {
  feature: {
    name: string;
    path: string;
  };
  inputs: Record<string, any>;
};

/**
 * he context variables passed to the template engine.
 */
const collectContextVariables = async (feature: Feature): Promise<FeatureContext> => {
  const {
    config: {
      name,
      inputs: featureInputs = [],
    },
    path: featurePath,
  } = feature;

  // Prompt the user for all feature inputs.
  const inputs = await collectInputs(featureInputs);

  return {
    feature: {
      name,
      path: featurePath,
    },
    inputs,
  };
};

/**
 * Collect the feature source files and parse the expressions.
 *
 * Compiles all the expressions from the configuration and returns the list of
 * source files that should be generated for a feature.
 */
const collectFeatureSourceFiles = (rootDir: string, feature: Feature, context: FeatureContext) => {
  const {
    config: {
      files: featureFiles = [],
    },
    path: featurePath,
  } = feature;

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
    .filter(({
      destination: destinationPath,
      source: sourcePath,
    }) => {
      // Ensure that the source exists and can be resolved.
      if (!existsSync(sourcePath)) {
        handleError(`Source file not found: ${sourcePath}`);
      }

      // Ensure that the destination does not exist.
      if (existsSync(destinationPath)) {
        handleError(`Destination file already exists: ${destinationPath}`);
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

  const context = await collectContextVariables(feature);
  const files = collectFeatureSourceFiles(rootDir, feature, context);

  if (!files.length) {
    handleError(`No files to generate for the feature ${featureName}`);
  }

  // Run each file through the expression parser and write the file to their new
  // file destination.
  // TODO: Allow entire directories to be handled.
  files.forEach(async ({ destination, source }) => {
    try {
      // Read the file from the source and parse the expressions.
      const file = parseExpression(readFileSync(source, 'utf8'), context);
      const destinationDir = dirname(destination);

      // Ensure that the directory exists.
      if (!existsSync(destinationDir) && !dryRun) {
        mkdirSync(destinationDir, { recursive: true });
      }

      if (!dryRun) {
        writeFileSync(destination, file);

        console.log(`${chalk.greenBright('✔')} Generated ${chalk.green(destination.replace(rootDir, '').replace(/^\//, ''))}`);
      } else {
        console.log(`Would generate ${chalk.green(destination.replace(rootDir, '').replace(/^\//, ''))}`);
      }
    } catch (error: any) {
      handleError(`Error writing from ${chalk.yellow(source)} to ${chalk.yellow(destination)}: ${chalk.white(error.message || '')}`);
    }
  });
}

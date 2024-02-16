import chalk from 'chalk';

import { Generator } from './generator';
import { parseExpression } from '../expressions';
import { logger } from '../logger';
import handleError from '../error';
import { configToGenerator } from '../features/configToGenerator'; // eslint-disable-line import/no-cycle

/**
 * Composite Generator
 *
 * Supports the creation of a feature compiled of multiple generators.
 */
export class CompositeGenerator extends Generator {
  /**
   * Process a feature and scaffold the files.
   */
  async invoke() {
    const {
      composite: {
        features = [],
        postCommand = null,
      } = {},
    } = this.config;

    // Loop through each feature and process it consecutively.
    for (const feature of features) { // eslint-disable-line no-restricted-syntax
      if (feature.name) {
        logger().info(`Processing feature: ${chalk.yellow(feature.name)}`);
      }

      const generator = configToGenerator(feature, this.path);
      generator.inputs = this.inputs;

      try {
        await generator.resolveAndInvoke(this.dryRun); // eslint-disable-line no-await-in-loop
      } catch (error: any) {
        handleError(error.message || error);
      }

      // Update the input with the latest inputs from the generator.
      this.inputs = { ...this.inputs, ...generator.inputs };
    }

    // console.log('features', this, features);

    // if (!features.length) {
    //   handleError('No features found to process');
    // }

    // const context = this.collectContextVariables();
    // const destination = this.getDestinationDirectory(parseExpression(`${destinationConfig}`, context));

    // if (this.dryRun) {
    //   logger().info(`Would be installing package ${chalk.yellow(packageName)} to ${chalk.yellow(destination)}`);
    // } else {
    //   logger().info(`Installing package ${chalk.yellow(packageName)} to ${chalk.yellow(destination)}`);

    //   const args = ['composer', 'create-project', packageName, destination];

    //   if (version) {
    //     args.push(version);
    //   }

    //   if (commandArgs) {
    //     args.push(commandArgs);
    //   }

    //   logger().info(`Running command: ${chalk.yellow(args.join(' '))}`);

    //   await runCommand(args.join(' '), process.cwd());
    // }

    // if (postCommand) {
    //   if (this.dryRun) {
    //     logger().info(`Would be running post command: ${chalk.yellow(postCommand)}`);
    //   } else {
    //     await this.runPostCommand(destination);
    //   }
    // }

    if (postCommand) {
      if (this.dryRun) {
        logger().info(`Would be running post command: ${chalk.yellow(postCommand)}`);
      } else {
        // await this.runPostCommand(destination);
      }
    }
  }
}

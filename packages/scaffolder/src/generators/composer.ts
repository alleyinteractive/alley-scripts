import chalk from 'chalk';

import { Generator } from './generator';
import { parseExpression } from '../expressions';
import { logger } from '../logger';
import { runCommand } from '../helpers';

/**
 * Composer-based feature.
 */
export class ComposerGenerator extends Generator {
  /**
   * Process a feature and scaffold the files.
   */
  async invoke() {
    const {
      composer: {
        args: commandArgs = null,
        package: packageName = null,
        destination: destinationConfig = null,
        postCommand = null,
        version = null,
      } = {},
    } = this.config;

    const context = this.collectContextVariables();
    const destination = this.getDestinationDirectory(parseExpression(`${destinationConfig}`, context));

    if (this.dryRun) {
      logger().info(`Would be installing package ${chalk.yellow(packageName)} to ${chalk.yellow(destination)}`);
    } else {
      logger().info(`Installing package ${chalk.yellow(packageName)} to ${chalk.yellow(destination)}`);

      const args = ['composer', 'create-project', packageName, destination];

      if (version) {
        args.push(version);
      }

      if (commandArgs) {
        args.push(commandArgs);
      }

      logger().info(`Running command: ${chalk.yellow(args.join(' '))}`);

      await runCommand(args.join(' '), process.cwd());
    }

    if (postCommand) {
      if (this.dryRun) {
        logger().info(`Would be running post command: ${chalk.yellow(postCommand)}`);
      } else {
        await this.runPostCommand(destination);
      }
    }
  }
}

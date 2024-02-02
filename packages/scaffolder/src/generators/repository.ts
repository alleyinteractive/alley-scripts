import chalk from 'chalk';
import fs from 'node:fs';
import { spawn } from 'node:child_process';

import handleError from '../error';
import { Generator } from './generator';
import { parseExpression } from '../expressions';
import { createGit } from '../git';
import { logger } from '../logger';

/**
 * Repository-based feature.
 */
export class RepositoryGenerator extends Generator {
  /**
   * Resolve the git URL from the configuration.
   */
  resolveGitUrl(): string { // eslint-disable-line consistent-return
    const {
      repository: {
        git: gitUrl = undefined,
        github = undefined,
      } = {},
    } = this.config;

    if (!gitUrl && !github) {
      handleError(`No git or github configuration found for ${chalk.yellow(this.config.name)}`);
    }

    if (github && (github.startsWith('https://') || github.startsWith('git@'))) {
      return github;
    }

    if (github) {
      const [, org, repo, revision] = github.match(/^(?:https:\/\/github.com\/)?([A-Za-z0-9_.-]*)\/([A-Za-z0-9_.-]*)(?:\.git)?(#[A-Za-z0-9_.-/]*)?$/) || [];

      return `https://github.com/${org}/${repo}.git${revision || ''}`;
    }

    if (gitUrl) {
      return gitUrl;
    }

    handleError(`No git or github configuration found for ${chalk.yellow(this.config.name)}`);
  }

  /**
   * Run the post clone command if one is specified with child_process.spawn().
   */
  runPostCloneCommand(destination: string): Promise<void> {
    const {
      repository: { postCloneCommand = '' } = {},
    } = this.config;

    logger().info(`Running post clone command: ${chalk.yellow(postCloneCommand)}`);

    return new Promise((resolve, reject) => {
      const run = spawn(postCloneCommand, [], {
        cwd: destination,
        shell: true,
        stdio: 'inherit',
      });

      run.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with code ${code}`));
        }
      });
    });
  }

  /**
   * Process a feature and scaffold the files.
   */
  async invoke() {
    const {
      repository: {
        destination: destinationConfig = undefined,
        postCloneCommand = undefined,
      } = {},
    } = this.config;

    const context = this.collectContextVariables();

    const destination = this.getDestinationDirectory(parseExpression(`${destinationConfig}`, context));

    // Check if the destination already exists and is not empty.
    if (fs.existsSync(destination) && fs.readdirSync(destination).length) {
      handleError(`Destination directory already exists: ${chalk.yellow(destination)}`);
    }

    if (!this.dryRun) {
      logger().debug(`Creating directory ${chalk.yellow(destination)}`);

      // Create the destination directory.
      fs.mkdirSync(destination, { recursive: true });
    } else {
      logger().debug(`Would be creating directory ${chalk.yellow(destination)}`);
    }

    if (!this.dryRun) {
      const [gitUrl, revision] = this.resolveGitUrl().split('#');

      logger().info(`Cloning ${chalk.green(gitUrl)} to ${chalk.yellow(destination)}`);

      const git = createGit(destination);

      await git.clone(gitUrl, destination);

      // Checkout a specific revision if one is specified.
      if (revision) {
        await git.checkout(revision);
      }
    } else {
      logger().info(`Would be cloning ${chalk.green(this.resolveGitUrl())} to ${chalk.yellow(destination)}`);
    }

    // Run the post clone command if one is specified.
    if (postCloneCommand) {
      if (!this.dryRun) {
        await this.runPostCloneCommand(destination);

        logger().debug('Post clone command complete');
      } else {
        logger().info(`Would be running post clone command: ${chalk.yellow(postCloneCommand)}`);
      }
    }
  }
}

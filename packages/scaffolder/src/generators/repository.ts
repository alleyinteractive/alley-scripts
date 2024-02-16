import chalk from 'chalk';
import fs from 'node:fs';

import handleError from '../error';
import { Generator } from './generator';
import { parseExpression } from '../expressions';
import { createGit } from '../git';
import { logger } from '../logger';
import { parseGitHubUrl, runCommand } from '../helpers';

/**
 * Repository-based feature.
 */
export class RepositoryGenerator extends Generator {
  /**
   * Resolve the git URL from the configuration.
   *
   * Will return the Git URL with the revision (if specified) appended with a hash.
   */
  resolveGitUrl(): string { // eslint-disable-line consistent-return
    const {
      repository: {
        git = undefined,
        github = undefined,
      } = {},
    } = this.config;

    if (!git && !github) {
      handleError(`No git or github configuration found for ${chalk.yellow(this.config.name)}`);
    }

    if (git) {
      if (typeof git === 'string') {
        return git;
      }

      const {
        git: gitUrl = undefined,
        url: gitUrlAlias = undefined,
        ref: gitRef = undefined,
      } = git;

      return `${gitUrl || gitUrlAlias || ''}${gitRef ? `#${gitRef}` : ''}`;
    }

    if (github) {
      if (typeof github === 'string') {
        return `https://github.com/${github}.git`;
      }

      const {
        github: githubName = undefined,
        url: githubUrl = undefined,
        ref: githubRef = undefined,
      } = github;

      if (githubName) {
        return `https://github.com/${githubName}.git${githubRef ? `#${githubRef}` : ''}`;
      }

      const { revision } = parseGitHubUrl(githubUrl || '');

      return `${githubUrl}${revision ? `#${revision}` : ''}`;
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

    return runCommand(postCloneCommand, destination);
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

      // Delete the .git directory.
      fs.rmSync(`${destination}/.git`, { recursive: true });
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

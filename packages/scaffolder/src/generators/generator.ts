import chalk from 'chalk';
import path from 'node:path';
import fs from 'node:fs';

// Services.
import { logger } from '../logger';
import { collectInputs } from '../inputs';
import { runCommand } from '../helpers';

// Types.
import type { FeatureConfig, FeatureContext } from '../types';

/**
 * Base generator class.
 */
export abstract class Generator {
  /* Feature configuration. */
  public config: FeatureConfig;

  /* Path to the directory that defined the feature. */
  public path: string;

  /* Resolved inputs for the feature. */
  public inputs: Record<string, string | boolean> = {};

  /* Whether the feature is a dry run. */
  public dryRun: boolean = false;

  /**
   * Constructor
   */
  constructor(config: FeatureConfig, directory: string) {
    this.config = config;
    this.path = directory;
  }

  /**
   * Run the post command if one is specified with child_process.spawn().
   */
  runPostCommand(destination: string): Promise<void> {
    const {
      composer: { postCommand = '' } = {},
    } = this.config;

    logger().info(`Running post command: ${chalk.yellow(postCommand)}`);

    return runCommand(postCommand, destination);
  }

  /**
   * Collect the context variables passed to the template engine.
   */
  public collectContextVariables() {
    const { name } = this.config;

    return {
      cwd: process.cwd(),
      feature: { name },
      inputs: this.inputs,
    } as FeatureContext;
  }

  /**
   * Resolve the inputs for the feature before being run.
   */
  public async collectInputs() {
    const {
      config: {
        'destination-resolver': destinationResolver = 'cwd',
      } = {},
      inputs: featureInputs = [],
    } = this.config;

    const cwd = process.cwd();

    // Intelligently prompt the user if they would like to place their
    // theme/plugin in the proper destination.
    if ((cwd.includes('wp-content') || fs.existsSync(`${cwd}/wp-content`)) && ['theme', 'plugin'].includes(destinationResolver)) {
      const wpContentPath = cwd.includes('wp-content')
        ? `${cwd.split('/wp-content')[0]}/wp-content`
        : `${cwd}/wp-content`;

      // Determine if the destination path should be resolved to a plugin or theme.
      if (destinationResolver === 'theme' && !cwd.endsWith('wp-content/themes')) {
        featureInputs.push({
          name: 'destination-resolver-theme',
          description: `Would you like to place the theme in the ${chalk.green(`${wpContentPath}/themes`)} directory?`,
          type: 'boolean',
          default: true,
        });
      } else if (destinationResolver === 'plugin' && !cwd.endsWith('wp-content/plugins')) {
        featureInputs.push({
          name: 'destination-resolver-plugin',
          description: `Would you like to place the plugin in the ${chalk.green(`${wpContentPath}/plugins`)} directory?`,
          type: 'boolean',
          default: true,
        });
      }
    }

    // Filter out any inputs that have already been resolved to prevent them
    // from being prompted again.
    const resolvedInputs = Object.keys(this.inputs);
    const unresolvedInputs = featureInputs.filter((input) => !resolvedInputs.includes(input.name));

    if (unresolvedInputs.length) {
      this.inputs = {
        ...this.inputs,
        ...await collectInputs(unresolvedInputs),
      };

      logger().debug(`Resolved ${Object.keys(this.inputs).length} input(s) for ${this.config.name}: ${JSON.stringify(this.inputs, null, 2)}`);
    }
  }

  /**
   * Get the destination directory for the feature.
   */
  public getDestinationDirectory(filePath: string = ''): string {
    const cwd = process.cwd();

    const {
      config: {
        config: {
          'destination-resolver': destinationResolver = 'cwd',
        } = {},
      } = {},
      inputs: {
        'destination-resolver-plugin': inputResolveToPluginDirectory = false,
        'destination-resolver-theme': inputResolveToThemeDirectory = false,
      } = {},
    } = this;

    if (['plugin', 'theme'].includes(destinationResolver)) {
      const wpContentPath = fs.existsSync(`${cwd}/wp-content`)
        ? `${cwd}/wp-content`
        : `${cwd.split('/wp-content')[0]}/wp-content`;

      if (destinationResolver === 'plugin' && inputResolveToPluginDirectory) {
        return `${wpContentPath}/plugins/${filePath}`;
      } if (destinationResolver === 'theme' && inputResolveToThemeDirectory) {
        return `${wpContentPath}/themes/${filePath}`;
      }
    }

    // Resolve the destination directory based on the relative path of the
    // configuration folder.
    if (destinationResolver === 'relative') {
      return path.resolve(this.path, filePath);
    }

    // Resolve the file to the parent folder of the .scaffolder directory. The
    // configuration file could either be .scaffolder/config.yml or
    // .scaffolder/<feature>/config.yml so we need to resolve the destination
    // based on the parent directory of the .scaffolder
    if (destinationResolver === 'relative-parent') {
      const [parentDirectory] = this.path.split(`${path.sep}.scaffolder`);

      return path.resolve(parentDirectory, filePath);
    }

    // Resolve the destination directory relative to the current
    // working directory.
    return path.resolve(cwd, filePath);
  }

  /**
   * Resolve the inputs for the feature and run it.
   */
  public async resolveAndInvoke(dryRun: boolean) {
    this.dryRun = dryRun;

    await this.collectInputs();

    logger().debug(`Running feature with config: ${JSON.stringify(this.config, null, 2)}`);

    await this.invoke();
  }

  /**
   * Run the feature.
   */
  abstract invoke(): Promise<void>;
}

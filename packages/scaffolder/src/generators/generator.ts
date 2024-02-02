import chalk from 'chalk';
import path from 'node:path';

// Services.
import { logger } from '../logger';
import { collectInputs } from '../inputs';

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
  constructor(config: FeatureConfig, path: string) {
    this.config = config;
    this.path = path;
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
        resolveToPluginDirectory = false,
        resolveToThemeDirectory = false,
      } = {},
      inputs: featureInputs = [],
    } = this.config;

    const cwd = process.cwd();

    // Intelligently prompt the user if they would like to place their
    // theme/plugin in the proper destination.
    if (cwd.includes('wp-content') && (resolveToPluginDirectory || resolveToThemeDirectory)) {
      const wpContentPath = `${cwd.split('/wp-content')[0]}/wp-content`;

      // Determine if the destination path should be resolved to a plugin or theme.
      if (resolveToThemeDirectory && !cwd.endsWith('wp-content/themes')) {
        featureInputs.push({
          name: 'resolveToThemeDirectory',
          description: `Would you like to place the theme in the ${chalk.green(`${wpContentPath}/themes`)} directory?`,
          type: 'boolean',
          default: true,
        });
      } else if (resolveToPluginDirectory && !cwd.endsWith('wp-content/plugins')) {
        featureInputs.push({
          name: 'resolveToPluginDirectory',
          description: `Would you like to place the plugin in the ${chalk.green(`${wpContentPath}/plugins`)} directory?`,
          type: 'boolean',
          default: true,
        });
      }
    }

    this.inputs = await collectInputs(featureInputs);

    logger().debug(`Resolved ${Object.keys(this.inputs).length} input(s) for ${this.config.name}: ${JSON.stringify(this.inputs, null, 2)}`);
  }

  /**
   * Get the destination directory for the feature.
   *
   * If there is a project configuration that is not the global configuration,
   * use the project directory. If not, use the current working directory.
   */
  public getDestinationDirectory(filePath: string = ''): string {
    const cwd = process.cwd();

    const {
      config: {
        config: {
          resolveToPluginDirectory = false,
          resolveToThemeDirectory = false,
          useCurrentDirectory = false,
        } = {},
      } = {},
      inputs: {
        resolveToPluginDirectory: inputResolveToPluginDirectory = false,
        resolveToThemeDirectory: inputResolveToThemeDirectory = false,
      } = {},
    } = this;

    if (resolveToPluginDirectory && inputResolveToPluginDirectory) {
      const wpContentPath = `${cwd.split('/wp-content')[0]}/wp-content`;

      if (resolveToPluginDirectory && inputResolveToPluginDirectory) {
        return `${wpContentPath}/plugins/${filePath}`;
      }
    } else if (resolveToThemeDirectory && inputResolveToThemeDirectory) {
      const wpContentPath = `${cwd.split('/wp-content')[0]}/wp-content`;

      if (resolveToThemeDirectory && inputResolveToThemeDirectory) {
        return `${wpContentPath}/themes/${filePath}`;
      }
    }

    if (useCurrentDirectory) {
      return `${cwd}/${filePath}`;
    }

    return path.resolve(this.path, filePath);
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

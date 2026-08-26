import chalk from 'chalk';
import path from 'node:path';
import fs from 'node:fs';

// Services.
import { logger } from '../logger';
import { collectInputs } from '../inputs';
import { loadFeatureHooks } from '../features/extensions';

// Types.
import type { RegisteredFeature, ScaffolderContext } from '../types';

/**
 * Base generator class.
 */
export abstract class Generator<T extends RegisteredFeature = RegisteredFeature> {
  /* Feature configuration. */
  public config: T;

  /* Path to the directory that defined the feature. */
  public path: string;

  /* Resolved inputs for the feature. */
  public inputs: Record<string, string | boolean> = {};

  /* Whether the feature is a dry run. */
  public dryRun: boolean = false;

  /**
   * Constructor
   */
  constructor(config: T, directory: string) {
    this.config = config;
    this.path = directory;
  }

  /**
   * Collect the context variables passed to the template engine.
   */
  public collectContextVariables(): ScaffolderContext {
    const { name, description } = this.config;

    return {
      cwd: process.cwd(),
      feature: { name, description },
      inputs: this.inputs,
      dryRun: this.dryRun,
      featureDirectory: this.path,
      resolveDestination: (relativePath = '') => this.getDestinationDirectory(relativePath),
      logger: logger(),
    };
  }

  /**
   * Resolve the inputs for the feature before being run.
   */
  public async collectInputs() {
    if (this.config.type !== 'javascript') {
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

      this.inputs = await collectInputs(featureInputs);

      logger().debug(`Resolved ${Object.keys(this.inputs).length} input(s) for ${this.config.name}: ${JSON.stringify(this.inputs, null, 2)}`);
    }
  }

  /**
   * Get the destination directory for the feature.
   */
  public getDestinationDirectory(filePath: string = ''): string {
    const cwd = process.cwd();

    const {
      inputs: {
        'destination-resolver-plugin': inputResolveToPluginDirectory = false,
        'destination-resolver-theme': inputResolveToThemeDirectory = false,
      } = {},
    } = this;
    const destinationResolver = this.config.type !== 'javascript'
      ? this.config.config?.['destination-resolver'] || 'cwd'
      : 'cwd';

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
   * Run a YAML lifecycle hook with feature and module provenance.
   */
  private async runHook(
    stage: 'beforeGenerate' | 'afterGenerate',
    hook: (context: ScaffolderContext) => Promise<void> | void,
    context: ScaffolderContext,
    hooksPath: string,
  ): Promise<void> {
    const modulePath = path.resolve(this.path, hooksPath);

    try {
      await hook(context);
    } catch (error) {
      throw new Error(
        `Error running "${stage}" lifecycle hook for feature "${this.config.name}" from "${hooksPath}" resolved to "${modulePath}".`,
        { cause: error },
      );
    }
  }

  /**
   * Resolve the inputs for the feature and run it.
   */
  public async resolveAndInvoke(dryRun: boolean) {
    this.dryRun = dryRun;

    await this.collectInputs();

    logger().debug(`Running feature with config: ${JSON.stringify(this.config, null, 2)}`);

    if (this.config.type === 'javascript' || !this.config.hooks) {
      await this.invoke();

      return;
    }

    const hooksPath = this.config.hooks;
    const hooks = await loadFeatureHooks(this.path, hooksPath);
    const context = this.collectContextVariables();

    if (hooks.beforeGenerate) {
      await this.runHook('beforeGenerate', hooks.beforeGenerate, context, hooksPath);
    }

    this.inputs = context.inputs;
    await this.invoke();

    if (hooks.afterGenerate) {
      await this.runHook('afterGenerate', hooks.afterGenerate, context, hooksPath);
    }
  }

  /**
   * Run the feature.
   */
  abstract invoke(): Promise<void>;
}

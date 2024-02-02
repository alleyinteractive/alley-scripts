import { logger } from '../logger';
import { collectInputs } from '../inputs';
import type { FeatureConfig, FeatureContext } from '../types';

/**
 * Base generator class.
 */
export abstract class Generator {
  /* Feature configuration. */
  public config: FeatureConfig;

  /* Path to the feature folder. */
  public path: string;

  /* Resolved inputs for the feature. */
  public inputs: Record<string, string | boolean> = {};

  /* Root directory for the project. */
  public rootDir: string;

  /* Whether the feature is a dry run. */
  public dryRun: boolean = false;

  /**
   * Constructor
   *
   * @param {FeatureConfig} config Feature configuration.
   * @param {string} path Path to the feature folder.
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
    const { inputs: featureInputs = [] } = this.config;

    this.inputs = await collectInputs(featureInputs);

    logger().debug(`Resolved ${Object.keys(this.inputs).length} input(s) for ${this.config.name}: ${JSON.stringify(this.inputs, null, 2)}`);
  }

  /**
   * Get the destination directory for the feature.
   *
   * If there is a project configuration that is not the global configuration,
   * use the project directory. If not, use the current working directory.
   */
  public getDestinationDirectory(path: string = ''): string {
    const {
      config: { useCwd = false } = {},
    } = this.config;

    // Use the current working directory if the feature is configured to do so.
    if (useCwd) {
      return `${process.cwd()}/${path}`;
    }

    // Determine if path is a relative directory.
    if (path.startsWith('./') || path.startsWith('../')) {
      if (getProjectScaffolderDirectory() === getGlobalDirectory()) {
        return `${process.cwd()}/${path}`;
      }

      return `${this.rootDir}/${path}`;
    }

    return path;
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

import { getProjectDirectory } from '../configuration';
import { logger } from '../logger';
import collectInputs from '../inputs';
import type { FeatureConfig, FeatureContext } from '../../types';

/**
 * Base feature class.
 */
abstract class Feature {
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
    this.rootDir = getProjectDirectory();
  }

  /**
   * Collect the context variables passed to the template engine.
   */
  collectContextVariables() {
    const { name } = this.config;

    return {
      feature: { name },
      inputs: this.inputs,
    } as FeatureContext;
  }

  /**
   * Resolve the inputs for the feature before being run.
   */
  protected async collectInputs() {
    const { inputs: featureInputs = [] } = this.config;

    this.inputs = await collectInputs(featureInputs);

    logger().debug(`Resolved ${Object.keys(this.inputs).length} input(s) for ${this.config.name}: ${JSON.stringify(this.inputs, null, 2)}`);
  }

  /**
   * Resolve the inputs for the feature and run it.
   */
  public async resolveAndInvoke(dryRun: boolean) {
    this.dryRun = dryRun;

    await this.collectInputs();
    await this.invoke();
  }

  /**
   * Run the feature.
   */
  abstract invoke(): Promise<void>;
}

export { Feature };

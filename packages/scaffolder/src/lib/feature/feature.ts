import { FeatureConfig, FeatureContext } from '../../types';
import collectInputs from '../inputs';
import { logger } from '../logger';

/**
 * Base feature class.
 */
abstract class Feature {
  /* Feature configuration. */
  public config: FeatureConfig;

  /* Path to the feature configuration file. */
  public configPath: string;

  /* Path to the feature folder. */
  public path: string;

  /* Resolved inputs for the feature. */
  public inputs: Record<string, string | boolean> = {};

  /* Root directory for the project. */
  public rootDir: string = '';

  /* Whether the feature is a dry run. */
  public dryRun: boolean = false;

  /**
   * Constructor
   */
  constructor(config: FeatureConfig, configPath: string, path: string) {
    this.config = config;
    this.configPath = configPath;
    this.path = path;
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
  public async resolveAndInvoke(rootDir: string, dryRun: boolean) {
    this.rootDir = rootDir;
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

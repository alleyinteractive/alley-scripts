import { definitionsFromPrompts, resolveInputs } from '../inputs';
import { Generator } from './generator';
import type { InputDefinition } from '../inputs';
import type { RegisteredJavaScriptFeature } from '../types';

/**
 * JavaScript-based feature.
 */
export class JavaScriptGenerator extends Generator<RegisteredJavaScriptFeature> {
  public feature: RegisteredJavaScriptFeature;

  constructor(feature: RegisteredJavaScriptFeature, directory: string) {
    super(feature, directory);
    this.feature = feature;
  }

  /**
   * Resolve custom feature inputs before generation.
   */
  public async collectInputs(): Promise<void> {
    if (!this.feature.prompts) {
      this.inputs = { ...this.providedInputs };

      return;
    }

    try {
      const questionsOrInputs = await this.feature.prompts(this.collectContextVariables());

      this.inputs = Array.isArray(questionsOrInputs)
        ? await resolveInputs(definitionsFromPrompts(questionsOrInputs), {
          provided: this.providedInputs,
          interactive: this.interactive,
          featureName: this.feature.name,
        })
        : { ...questionsOrInputs, ...this.providedInputs };
    } catch (error) {
      throw new Error(`Error collecting inputs for feature "${this.feature.name}".`, { cause: error });
    }
  }

  /**
   * Describe the inputs from the feature's prompts.
   */
  public async describeInputs(): Promise<InputDefinition[]> {
    if (!this.feature.prompts) {
      return [];
    }

    const questions = await this.feature.prompts(this.collectContextVariables());

    return Array.isArray(questions) ? definitionsFromPrompts(questions) : [];
  }

  /**
   * Run a JavaScript feature.
   */
  public async invoke(): Promise<void> {
    try {
      await this.feature.generate(this.collectContextVariables());
    } catch (error) {
      throw new Error(`Error generating feature "${this.feature.name}".`, { cause: error });
    }
  }
}

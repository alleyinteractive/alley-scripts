import prompts from 'prompts';

import handleError from '../error';
import { Generator } from './generator';
import type { JavaScriptFeature } from '../types';

/**
 * JavaScript-based feature.
 */
export class JavaScriptGenerator extends Generator<JavaScriptFeature> {
  public feature: JavaScriptFeature;

  constructor(feature: JavaScriptFeature, directory: string) {
    super(feature, directory);
    this.feature = feature;
  }

  /**
   * Resolve custom feature inputs before generation.
   */
  public async collectInputs(): Promise<void> {
    if (!this.feature.prompts) {
      this.inputs = {};

      return;
    }

    try {
      const questionsOrInputs = await this.feature.prompts(this.collectContextVariables());

      this.inputs = Array.isArray(questionsOrInputs)
        ? await prompts(questionsOrInputs, { onCancel: () => handleError('User cancelled.') })
        : questionsOrInputs;
    } catch (error) {
      throw new Error(`Error collecting inputs for feature "${this.feature.name}".`, { cause: error });
    }
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

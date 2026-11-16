import type prompts from 'prompts';
import type { Logger } from 'winston';
import type { FeatureConfig } from './config';

export type ScaffolderContext = {
  cwd: string;
  feature: Pick<FeatureConfig, 'name' | 'description'>;
  inputs: Record<string, any>;
  dryRun: boolean;
  featureDirectory: string;
  resolveDestination: (relativePath?: string) => string;
  logger: Logger;
  /* Record a file the feature created or modified, reported by --json. */
  recordFile: (filePath: string, action?: GeneratedFile['action']) => void;
};

export type GeneratedFile = {
  path: string;
  action: 'created' | 'modified';
};

export type JavaScriptFeature = {
  name: string;
  description?: string;
  prompts?: (
    context: ScaffolderContext,
  ) => Promise<prompts.PromptObject[] | Record<string, any>>
  | prompts.PromptObject[]
  | Record<string, any>;
  generate: (context: ScaffolderContext) => Promise<void> | void;
};

export type RegisteredJavaScriptFeature = JavaScriptFeature & {
  type: 'javascript';
};

export type FeatureHookModule = {
  beforeGenerate?: (context: ScaffolderContext) => Promise<void> | void;
  afterGenerate?: (context: ScaffolderContext) => Promise<void> | void;
};

export type RegisteredFeature = FeatureConfig | RegisteredJavaScriptFeature;
export type FeatureContext = ScaffolderContext;

import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { JavaScriptFeature } from '../types';

export type LoadedFeaturePackage = {
  directory: string;
  features: JavaScriptFeature[];
  packageName: string;
};

type FeaturePackageManifest = {
  name?: unknown;
  scaffolder?: unknown;
};

type DynamicImporter = (specifier: string) => Promise<Record<string, unknown>>;

// Keep dynamic import native when this module is compiled for Jest's CommonJS runtime.
const importModule = new Function('specifier', 'return import(specifier);') as DynamicImporter; // eslint-disable-line no-new-func, @typescript-eslint/no-implied-eval

function assertJavaScriptFeature(
  value: unknown,
  packageName: string,
): asserts value is Omit<JavaScriptFeature, 'type'> {
  if (!value || typeof value !== 'object') {
    throw new Error(`Scaffolder package "${packageName}" must export a feature object or array.`);
  }
  if (!('name' in value) || typeof value.name !== 'string' || !value.name) {
    throw new Error(`Scaffolder package "${packageName}" exported a feature without a valid name.`);
  }
  if (!('generate' in value) || typeof value.generate !== 'function') {
    throw new Error(`Scaffolder package "${packageName}" feature "${value.name}" must define generate().`);
  }
  if ('prompts' in value && value.prompts !== undefined && typeof value.prompts !== 'function') {
    throw new Error(`Scaffolder package "${packageName}" feature "${value.name}" has an invalid prompts callback.`);
  }
}

/**
 * Load JavaScript scaffolder features exported by an npm package.
 */
export async function loadFeaturePackage(manifestPath: string): Promise<LoadedFeaturePackage> {
  const directory = path.dirname(manifestPath);
  let manifest: FeaturePackageManifest;

  try {
    const parsed = JSON.parse(await fs.readFile(manifestPath, 'utf8')) as unknown;

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('expected a JSON object');
    }

    manifest = parsed as FeaturePackageManifest;
  } catch (error: any) {
    throw new Error(`Scaffolder package "${path.basename(directory)}" has an invalid package manifest: ${error.message}`);
  }

  const packageName = typeof manifest.name === 'string' && manifest.name
    ? manifest.name
    : path.basename(directory);

  if (typeof manifest.scaffolder !== 'string' || !manifest.scaffolder) {
    throw new Error(`Scaffolder package "${packageName}" must define a valid scaffolder entry point.`);
  }

  const entryPath = path.resolve(directory, manifest.scaffolder);
  let namespace: Record<string, unknown>;

  try {
    namespace = await importModule(pathToFileURL(entryPath).href);
  } catch (error: any) {
    throw new Error(`Scaffolder package "${packageName}" could not load scaffolder entry point "${manifest.scaffolder}": ${error.message}`);
  }

  const exported = namespace.default ?? namespace;
  const features = Array.isArray(exported) ? exported : [exported];

  features.forEach((feature) => assertJavaScriptFeature(feature, packageName));

  return {
    directory: path.dirname(entryPath),
    features: features.map((feature) => ({ ...feature, type: 'javascript' })),
    packageName,
  };
}

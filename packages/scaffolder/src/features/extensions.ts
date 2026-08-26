import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import type { FeatureHookModule, JavaScriptFeature } from '../types';

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

const supportedHookNames = ['beforeGenerate', 'afterGenerate'] as const;
type SupportedHookName = (typeof supportedHookNames)[number];

// Keep dynamic import native when this module is compiled for Jest's CommonJS runtime.
const importModule = new Function('specifier', 'return import(specifier);') as DynamicImporter; // eslint-disable-line no-new-func, @typescript-eslint/no-implied-eval

let testImportId = 0;

function moduleSpecifier(modulePath: string): string {
  const specifier = pathToFileURL(modulePath).href;

  // Jest runs every suite in a separate VM context. Cache-bust fixture imports
  // so a later suite does not receive a module tied to an earlier, torn-down
  // context. Production keeps Node's normal module cache.
  if (!process.env.JEST_WORKER_ID) {
    return specifier;
  }

  const importId = testImportId;
  testImportId += 1;

  return `${specifier}?scaffolder-test-import=${importId}`;
}

function hookExport(
  namespace: Record<string, unknown>,
  hookName: SupportedHookName,
): { defined: boolean; value: unknown } {
  if (hookName in namespace) {
    return { defined: true, value: namespace[hookName] };
  }

  const defaultExport = namespace.default;

  if (defaultExport && typeof defaultExport === 'object' && hookName in defaultExport) {
    return { defined: true, value: defaultExport[hookName as keyof typeof defaultExport] };
  }

  return { defined: false, value: undefined };
}

/**
 * Load lifecycle hooks declared by a YAML feature.
 */
export async function loadFeatureHooks(
  featureDirectory: string,
  hooksPath: string,
): Promise<FeatureHookModule> {
  const modulePath = path.resolve(featureDirectory, hooksPath);
  let namespace: Record<string, unknown>;

  try {
    namespace = await importModule(moduleSpecifier(modulePath));
  } catch (error: any) {
    throw new Error(
      `Could not load YAML lifecycle hook module "${hooksPath}" resolved to "${modulePath}". Supported hooks are "beforeGenerate" and "afterGenerate": ${error.message}`,
      { cause: error },
    );
  }

  const hooks: FeatureHookModule = {};

  supportedHookNames.forEach((hookName) => {
    const exported = hookExport(namespace, hookName);

    if (!exported.defined) {
      return;
    }

    if (typeof exported.value !== 'function') {
      throw new Error(
        `YAML lifecycle hook module "${hooksPath}" resolved to "${modulePath}" must export "${hookName}" as a function. Supported hooks are "beforeGenerate" and "afterGenerate".`,
      );
    }

    if (hookName === 'beforeGenerate') {
      hooks.beforeGenerate = exported.value as FeatureHookModule['beforeGenerate'];
    } else {
      hooks.afterGenerate = exported.value as FeatureHookModule['afterGenerate'];
    }
  });

  if (!hooks.beforeGenerate && !hooks.afterGenerate) {
    throw new Error(
      `YAML lifecycle hook module "${hooksPath}" resolved to "${modulePath}" must export at least one supported hook: "beforeGenerate" or "afterGenerate".`,
    );
  }

  return hooks;
}

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
    namespace = await importModule(moduleSpecifier(entryPath));
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

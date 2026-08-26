# JavaScript Scaffolder Extensions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Allow installed packages to register JavaScript scaffolder features and allow YAML features to run JavaScript before and after their built-in generator.

**Architecture:** Add a discriminated JavaScript feature type alongside the existing YAML configuration, discover package entry points through a `scaffolder` manifest field, and route both types through the existing generator abstraction. Expand the generator context once, then use it for custom prompts/generation and optional YAML lifecycle hooks.

**Tech Stack:** Node.js 22+, TypeScript 5, CommonJS Babel output, Jest/ts-jest, `prompts`, Joi, `fast-glob`, npm workspaces.

**Spec:** `docs/superpowers/specs/2026-08-26-javascript-scaffolder-extensions-design.md`

## Global Constraints

- Third-party extension implementations are ordinary JavaScript and require no compilation.
- Extension code executes in-process as trusted code with the user's permissions.
- Existing YAML features, generators, CLI arguments, names, and destination behavior remain backward-compatible.
- Package modules support both ES module default exports and CommonJS `module.exports`.
- YAML lifecycle is input collection, `beforeGenerate`, built-in generation, then `afterGenerate`.
- Hooks execute during dry runs; custom code is responsible for avoiding mutations when `context.dryRun` is true.
- No lifecycle stages beyond `beforeGenerate` and `afterGenerate` are added.
- Every production behavior must first be demonstrated by a focused failing test.

---

## File Structure

- Create `packages/scaffolder/src/features/extensions.ts`: normalize, validate, and import JavaScript feature and hook modules.
- Create `packages/scaffolder/src/features/extensions.spec.ts`: module-format, validation, and error tests.
- Create `packages/scaffolder/src/generators/javascript.ts`: execute custom prompts and JavaScript generation callbacks.
- Create `packages/scaffolder/src/generators/javascript.spec.ts`: JavaScript feature lifecycle and context tests.
- Create `packages/scaffolder/src/generators/generator.spec.ts`: YAML hook lifecycle tests against a minimal test generator.
- Create fixtures beneath `packages/scaffolder/__tests__/fixtures/node_modules/`: scoped/unscoped manifest discovery and CommonJS/ES module exports.
- Modify `packages/scaffolder/src/types/config.ts`: add the optional YAML `hooks` field.
- Modify `packages/scaffolder/src/types/feature.ts`: define shared context, JavaScript feature, and registered feature contracts.
- Modify `packages/scaffolder/src/yaml.ts`: validate the YAML `hooks` path.
- Modify `packages/scaffolder/src/features/store.ts`: discover and register JavaScript package features.
- Modify `packages/scaffolder/src/features/store.spec.ts`: test package discovery and fault isolation.
- Modify `packages/scaffolder/src/features/configToGenerator.ts`: select the JavaScript generator.
- Modify `packages/scaffolder/src/features/prompt.ts`: accept the registered feature union.
- Modify `packages/scaffolder/src/generators/generator.ts`: construct shared context and wrap YAML invocation with hooks.
- Modify `packages/scaffolder/src/generators/index.ts`: export the JavaScript generator.
- Modify `packages/scaffolder/src/index.ts`: ensure public extension types and helpers are exported through existing barrels.
- Modify `packages/scaffolder/docs/2-features.md`: document package features, hooks, lifecycle, context, dry runs, and trust.
- Modify `packages/scaffolder/README.md`: link to JavaScript extension documentation.
- Create `.changeset/fuzzy-tools-build.md`: record a minor release for `@alleyinteractive/scaffolder`.

### Task 1: Define and validate the public contracts

**Files:**
- Modify: `packages/scaffolder/src/types/config.ts`
- Modify: `packages/scaffolder/src/types/feature.ts`
- Modify: `packages/scaffolder/src/yaml.ts`
- Test: `packages/scaffolder/src/yaml.spec.ts`

**Interfaces:**
- Consumes: existing `FeatureConfig`, `FeatureContext`, and `validateFeatureConfiguration(config)`.
- Produces: `JavaScriptFeature`, `RegisteredFeature`, `ScaffolderContext`, `FeatureHookModule`, and `FeatureConfig.hooks?: string`.

- [ ] **Step 1: Write a failing schema test for YAML hooks**

Create `packages/scaffolder/src/yaml.spec.ts` with a valid relative hook and an invalid non-string hook:

```ts
import { validateFeatureConfiguration } from './yaml';

describe('validateFeatureConfiguration', () => {
  it('accepts a JavaScript hooks module on a YAML feature', () => {
    expect(() => validateFeatureConfiguration({
      name: 'post-type',
      type: 'file',
      hooks: './hooks.js',
      files: [{ source: 'post-type.stub' }],
    })).not.toThrow();
  });

  it('rejects a non-string hooks module', () => {
    expect(() => validateFeatureConfiguration({
      name: 'post-type',
      type: 'file',
      hooks: true,
      files: [{ source: 'post-type.stub' }],
    })).toThrow('"hooks" must be a string');
  });
});
```

- [ ] **Step 2: Run the schema test and verify the new field fails validation**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/yaml.spec.ts`

Expected: FAIL because the schema does not currently allow the `hooks` field.

- [ ] **Step 3: Add the contracts and schema field**

Add `hooks?: string` to `FeatureConfig` and `hooks: Joi.string()` to `featureConfigSchema`. Replace the narrow context in `types/feature.ts` with these exported contracts:

```ts
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
};

export type JavaScriptFeature = {
  type: 'javascript';
  name: string;
  description?: string;
  prompts?: (
    context: ScaffolderContext,
  ) => Promise<prompts.PromptObject[] | Record<string, any>>
    | prompts.PromptObject[]
    | Record<string, any>;
  generate: (context: ScaffolderContext) => Promise<void> | void;
};

export type FeatureHookModule = {
  beforeGenerate?: (context: ScaffolderContext) => Promise<void> | void;
  afterGenerate?: (context: ScaffolderContext) => Promise<void> | void;
};

export type RegisteredFeature = FeatureConfig | JavaScriptFeature;
export type FeatureContext = ScaffolderContext;
```

Keep `type: 'javascript'` mandatory internally; the module loader in Task 2 adds it to author exports so package authors need not specify it.

- [ ] **Step 4: Run focused tests and type checking**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/yaml.spec.ts`

Expected: PASS, 2 tests.

Run: `npm run lint --workspace=@alleyinteractive/scaffolder`

Expected: PASS with no TypeScript or ESLint errors. Update current internal context construction sites only as needed to satisfy the new required fields; do not add hook behavior yet.

- [ ] **Step 5: Commit the contracts**

```bash
git add packages/scaffolder/src/types packages/scaffolder/src/yaml.ts packages/scaffolder/src/yaml.spec.ts
git commit -m "Add scaffolder extension contracts"
```

### Task 2: Load and discover JavaScript package features

**Files:**
- Create: `packages/scaffolder/src/features/extensions.ts`
- Create: `packages/scaffolder/src/features/extensions.spec.ts`
- Create: `packages/scaffolder/__tests__/fixtures/node_modules/plain-scaffolder/package.json`
- Create: `packages/scaffolder/__tests__/fixtures/node_modules/plain-scaffolder/scaffolder.cjs`
- Create: `packages/scaffolder/__tests__/fixtures/node_modules/@fixture/scoped-scaffolder/package.json`
- Create: `packages/scaffolder/__tests__/fixtures/node_modules/@fixture/scoped-scaffolder/scaffolder.mjs`
- Modify: `packages/scaffolder/src/features/store.ts`
- Modify: `packages/scaffolder/src/features/store.spec.ts`
- Modify: `packages/scaffolder/src/features/index.ts`

**Interfaces:**
- Consumes: `JavaScriptFeature`, `RegisteredFeature`, the feature store's npm roots, `logger()`.
- Produces: `loadFeaturePackage(manifestPath: string): Promise<LoadedFeaturePackage>`, where `LoadedFeaturePackage` is `{ directory: string; features: JavaScriptFeature[]; packageName: string }`.

- [ ] **Step 1: Add failing loader tests and explicit fixtures**

Write manifests whose `scaffolder` values point to their fixture modules. The CommonJS fixture exports one feature; the ES module fixture default-exports two. Test normalization and validation:

```ts
import path from 'node:path';
import { loadFeaturePackage } from './extensions';

const modulesPath = path.resolve(__dirname, '../../__tests__/fixtures/node_modules');

describe('loadFeaturePackage', () => {
  it('loads a CommonJS package feature', async () => {
    const loaded = await loadFeaturePackage(
      path.join(modulesPath, 'plain-scaffolder/package.json'),
    );
    expect(loaded.packageName).toBe('plain-scaffolder');
    expect(loaded.features).toEqual([
      expect.objectContaining({ name: 'plain-feature', type: 'javascript' }),
    ]);
  });

  it('loads multiple ES module features', async () => {
    const loaded = await loadFeaturePackage(
      path.join(modulesPath, '@fixture/scoped-scaffolder/package.json'),
    );
    expect(loaded.features.map(({ name }) => name)).toEqual(['first-feature', 'second-feature']);
  });
});
```

Add table-driven cases using temporary manifest paths for a missing entry point, a feature without `name`, and a feature without `generate`. Assert each rejection includes the package name and invalid field.

- [ ] **Step 2: Run loader tests and verify the missing-module failure**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features/extensions.spec.ts`

Expected: FAIL because `./extensions` does not exist.

- [ ] **Step 3: Implement module loading and validation**

In `extensions.ts`, read and validate the manifest, resolve its entry point, import it through `pathToFileURL(entryPath).href`, normalize `namespace.default ?? namespace`, coerce a single export to an array, and return copies with `type: 'javascript'`. Use an assertion with these exact rules:

```ts
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
```

Export the loader from `features/index.ts`.

- [ ] **Step 4: Run loader tests and verify they pass**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features/extensions.spec.ts`

Expected: PASS for CommonJS, ES modules, arrays, and invalid package cases.

- [ ] **Step 5: Add a failing feature-store discovery test**

Make npm-root discovery testable by changing the constructor to accept an optional roots resolver while retaining the production default:

```ts
type NpmPathsResolver = () => string[];

public constructor(
  store: ConfigurationStore,
  npmPaths: NpmPathsResolver = FeatureStore.getNpmPaths,
) { /* store both dependencies */ }
```

First write the test against that intended signature:

```ts
it('discovers scoped and unscoped JavaScript feature packages', async () => {
  const store = new FeatureStore(new ConfigurationStore(), () => [
    path.join(fixturesPath, 'node_modules'),
  ]);
  await store.initialize();

  expect(Object.values(store.all()).flat().map(({ name }) => name)).toEqual(
    expect.arrayContaining(['plain-feature', 'first-feature', 'second-feature']),
  );
});
```

Spy on `logger().warn` in a second test, add a fixture manifest with an invalid entry point, and assert valid packages remain registered while the warning names the invalid package.

- [ ] **Step 6: Run the store test and verify discovery fails**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features/store.spec.ts`

Expected: FAIL because the store does not inspect package manifests or accept an npm-root resolver.

- [ ] **Step 7: Implement manifest discovery with per-package isolation**

Add `FeatureStore.getNpmPaths()` to deduplicate the existing local/global methods. In `loadFromNodeModules`, keep current YAML globs and additionally glob `*/package.json` and `@*/*/package.json`. Parse only manifests containing a string `scaffolder` field, call `loadFeaturePackage`, and register returned features under their entry-point directory. Catch errors around each manifest and warn without rejecting the full initialization.

Change the store map and methods from `FeatureConfig[]` to `RegisteredFeature[]`. Update `promptUserForFeature` to return `[RegisteredFeature, string]`; selection logic itself does not change.

- [ ] **Step 8: Run store, loader, and prompt tests**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features`

Expected: PASS with JavaScript and YAML features discovered together and invalid packages isolated.

- [ ] **Step 9: Commit package discovery**

```bash
git add packages/scaffolder/src/features packages/scaffolder/__tests__/fixtures/node_modules
git commit -m "Discover JavaScript scaffolder packages"
```

### Task 3: Execute JavaScript features with custom prompts

**Files:**
- Create: `packages/scaffolder/src/generators/javascript.ts`
- Create: `packages/scaffolder/src/generators/javascript.spec.ts`
- Modify: `packages/scaffolder/src/generators/generator.ts`
- Modify: `packages/scaffolder/src/generators/index.ts`
- Modify: `packages/scaffolder/src/features/configToGenerator.ts`
- Modify: `packages/scaffolder/src/command.ts`

**Interfaces:**
- Consumes: `JavaScriptFeature`, `ScaffolderContext`, `Generator.resolveAndInvoke(dryRun)`.
- Produces: `JavaScriptGenerator`, plus `featureToGenerator(feature: RegisteredFeature, directory: string): Generator` (renamed from `configToGenerator`, with a temporary re-export alias if external compatibility requires it).

- [ ] **Step 1: Write failing tests for prompt definitions and resolved inputs**

Use `prompt.inject()` for a feature returning prompt definitions:

```ts
import { prompt } from 'prompts';
import { JavaScriptGenerator } from './javascript';

it('collects custom prompt answers before generation', async () => {
  prompt.inject(['book']);
  const generate = jest.fn();
  const generator = new JavaScriptGenerator({
    type: 'javascript',
    name: 'post-type',
    prompts: () => [{ name: 'slug', type: 'text', message: 'Slug' }],
    generate,
  }, '/extensions/post-type');

  await generator.resolveAndInvoke(false);

  expect(generate).toHaveBeenCalledWith(expect.objectContaining({
    inputs: { slug: 'book' },
  }));
});
```

Add a second test where `prompts()` returns `{ slug: 'movie' }` directly. Assert `generate` receives that object without invoking the `prompts` library.

- [ ] **Step 2: Run the JavaScript generator tests and verify failure**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/generators/javascript.spec.ts`

Expected: FAIL because `JavaScriptGenerator` does not exist.

- [ ] **Step 3: Expand the base generator context**

Change `Generator.config` and its constructor to accept `RegisteredFeature`. Update `collectContextVariables()` to return:

```ts
return {
  cwd: process.cwd(),
  feature: {
    name: this.config.name,
    description: this.config.description,
  },
  inputs: this.inputs,
  dryRun: this.dryRun,
  featureDirectory: this.path,
  resolveDestination: (filePath = '') => this.getDestinationDirectory(filePath),
  logger: logger(),
};
```

Keep YAML-specific input collection in the base class guarded by the `type !== 'javascript'` discriminator so existing generators remain typed correctly.

- [ ] **Step 4: Implement the JavaScript generator**

Override `collectInputs()` in `JavaScriptGenerator`. Call the feature's optional `prompts` callback with the initial context. If the return is an array, pass it to the imported `prompts` function with the existing cancellation handler; otherwise treat it as resolved inputs. Assign the result to `this.inputs`.

Implement `invoke()` as:

```ts
public async invoke(): Promise<void> {
  await this.feature.generate(this.collectContextVariables());
}
```

Wrap errors from prompts and generation with the feature name and stage while retaining the original error as `cause`.

- [ ] **Step 5: Run JavaScript generator tests**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/generators/javascript.spec.ts`

Expected: PASS for prompt definitions, direct input objects, omitted prompts, context fields, async generation, and error provenance.

- [ ] **Step 6: Add a failing routing test**

Extend or create `packages/scaffolder/src/features/configToGenerator.spec.ts`:

```ts
it('creates a JavaScript generator for a JavaScript feature', () => {
  const generator = featureToGenerator({
    type: 'javascript',
    name: 'post-type',
    generate: async () => {},
  }, '/extensions/post-type');

  expect(generator).toBeInstanceOf(JavaScriptGenerator);
});
```

- [ ] **Step 7: Run routing test and verify it fails**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features/configToGenerator.spec.ts`

Expected: FAIL because `featureToGenerator` and JavaScript routing do not exist.

- [ ] **Step 8: Route selected features through the common factory**

Rename the factory implementation to `featureToGenerator`, add the `type === 'javascript'` branch, and export `configToGenerator` as an alias for backward compatibility. Update `ScaffolderCommand.invoke()` to call `featureToGenerator(...feature).resolveAndInvoke(dryRun)`.

- [ ] **Step 9: Run generator, routing, and command tests**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/generators src/features/configToGenerator.spec.ts`

Expected: PASS, including all pre-existing file, Composer, and repository generator tests.

- [ ] **Step 10: Commit JavaScript execution**

```bash
git add packages/scaffolder/src/generators packages/scaffolder/src/features/configToGenerator.ts packages/scaffolder/src/features/configToGenerator.spec.ts packages/scaffolder/src/command.ts
git commit -m "Run custom JavaScript scaffolder features"
```

### Task 4: Run YAML lifecycle hooks

**Files:**
- Modify: `packages/scaffolder/src/features/extensions.ts`
- Modify: `packages/scaffolder/src/features/extensions.spec.ts`
- Create: `packages/scaffolder/src/generators/generator.spec.ts`
- Modify: `packages/scaffolder/src/generators/generator.ts`
- Create: `packages/scaffolder/__tests__/fixtures/hooks/lifecycle.cjs`
- Create: `packages/scaffolder/__tests__/fixtures/hooks/invalid.cjs`

**Interfaces:**
- Consumes: `FeatureConfig.hooks`, `FeatureHookModule`, `ScaffolderContext`.
- Produces: `loadFeatureHooks(featureDirectory: string, hooksPath: string): Promise<FeatureHookModule>` and lifecycle execution in `Generator.resolveAndInvoke()`.

- [ ] **Step 1: Add failing hook-loader tests**

Test that `loadFeatureHooks()` resolves paths relative to the feature directory and returns named CommonJS exports. Add invalid cases for a missing file and a module exporting neither hook. Assert messages contain the resolved module and supported hook names.

```ts
const hooks = await loadFeatureHooks(fixturesPath, './hooks/lifecycle.cjs');
expect(hooks.beforeGenerate).toEqual(expect.any(Function));
expect(hooks.afterGenerate).toEqual(expect.any(Function));
```

- [ ] **Step 2: Run hook-loader tests and verify failure**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features/extensions.spec.ts`

Expected: FAIL because `loadFeatureHooks` is not exported.

- [ ] **Step 3: Implement hook loading and validation**

Resolve `hooksPath` against `featureDirectory`, dynamically import it, and normalize named exports from either the namespace or its CommonJS default object. Reject non-function values for supported hook names and reject modules with neither supported function.

- [ ] **Step 4: Run hook-loader tests**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/features/extensions.spec.ts`

Expected: PASS for valid, missing, and invalid hook modules.

- [ ] **Step 5: Write failing lifecycle tests around a minimal generator**

Define a `TestGenerator extends Generator` inside `generator.spec.ts` whose `invoke()` appends `generate` to an events array. Mock `loadFeatureHooks` to return callbacks that append their stage names. Assert exact order:

```ts
expect(events).toEqual(['before', 'generate', 'after']);
```

Add focused tests proving:

- `beforeGenerate` can set `context.inputs.added = 'from-hook'` and `invoke()` sees it.
- `afterGenerate` receives the same inputs object.
- `afterGenerate` is not called when `beforeGenerate` throws.
- `afterGenerate` is not called when `invoke()` throws.
- Both hooks receive `dryRun: true` during `resolveAndInvoke(true)`.
- A YAML feature without `hooks` follows the current input-then-invoke path.

- [ ] **Step 6: Run lifecycle tests and verify ordering fails**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/generators/generator.spec.ts`

Expected: FAIL because `resolveAndInvoke()` does not load or run hooks.

- [ ] **Step 7: Wrap YAML generation with hooks**

In `Generator.resolveAndInvoke()`:

```ts
this.dryRun = dryRun;
await this.collectInputs();

if (this.config.type === 'javascript' || !this.config.hooks) {
  await this.invoke();
  return;
}

const hooks = await loadFeatureHooks(this.path, this.config.hooks);
const context = this.collectContextVariables();

if (hooks.beforeGenerate) {
  await runHook('beforeGenerate', hooks.beforeGenerate, context);
}
this.inputs = context.inputs;
await this.invoke();
if (hooks.afterGenerate) {
  await runHook('afterGenerate', hooks.afterGenerate, context);
}
```

Implement `runHook` as a private method or focused helper that wraps thrown errors with feature name, stage, and module path using `cause`. Preserve the same mutable context object across both hooks.

- [ ] **Step 8: Run lifecycle and built-in generator tests**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand src/generators`

Expected: PASS for new lifecycle tests and all existing generator tests.

- [ ] **Step 9: Commit YAML hooks**

```bash
git add packages/scaffolder/src/features/extensions.ts packages/scaffolder/src/features/extensions.spec.ts packages/scaffolder/src/generators/generator.ts packages/scaffolder/src/generators/generator.spec.ts packages/scaffolder/__tests__/fixtures/hooks
git commit -m "Add JavaScript hooks to YAML scaffolder features"
```

### Task 5: Document and release the extension API

**Files:**
- Modify: `packages/scaffolder/docs/2-features.md`
- Modify: `packages/scaffolder/README.md`
- Modify: `packages/scaffolder/src/index.ts`
- Create: `.changeset/fuzzy-tools-build.md`

**Interfaces:**
- Consumes: final `JavaScriptFeature`, `ScaffolderContext`, manifest, hook, lifecycle, and dry-run behavior.
- Produces: published type exports, author documentation, and a minor changeset.

- [ ] **Step 1: Verify public type exports before editing documentation**

Create a temporary TypeScript import check through the package's `src/index.ts`, or add a compile-only assertion in `src/index.spec.ts`, importing:

```ts
import type {
  FeatureHookModule,
  JavaScriptFeature,
  RegisteredFeature,
  ScaffolderContext,
} from './index';
```

Run: `npm run build:types --workspace=@alleyinteractive/scaffolder`

Expected: PASS. If an import is missing, update only the necessary barrel export and rerun until it passes.

- [ ] **Step 2: Add the JavaScript package authoring guide**

Append a `JavaScript Feature Packages` section to `docs/2-features.md` containing:

- The exact `package.json` manifest from the spec.
- A single default-export feature using custom prompt definitions.
- An array default export example.
- A custom `prompts()` example that returns a resolved input object.
- The complete shared-context field reference.
- CommonJS and ES module export examples.
- Discovery warning behavior.

Use runnable JavaScript examples without TypeScript syntax.

- [ ] **Step 3: Add the YAML hooks guide**

Add a `JavaScript Hooks for YAML Features` section containing the exact YAML and JavaScript examples from the spec, lifecycle ordering, mutable input behavior, failure semantics, and this dry-run guard:

```js
export async function afterGenerate(context) {
  if (context.dryRun) {
    context.logger.info('Would update the post type registry.');
    return;
  }

  // Update the registry here.
}
```

Include a prominent note that extension modules are trusted code and execute with the user's permissions.

- [ ] **Step 4: Link the README to extension documentation**

Add a short paragraph beneath the documentation list linking to the JavaScript package and YAML hook anchors in `docs/2-features.md`.

- [ ] **Step 5: Add a minor changeset**

Create `.changeset/fuzzy-tools-build.md` with:

```md
---
"@alleyinteractive/scaffolder": minor
---

Add support for JavaScript feature packages and lifecycle hooks in YAML features.
```

- [ ] **Step 6: Run focused package verification**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand`

Expected: PASS with zero failed suites and zero failed tests.

Run: `npm run lint --workspace=@alleyinteractive/scaffolder`

Expected: PASS with no TypeScript or ESLint errors.

Run: `npm run build --workspace=@alleyinteractive/scaffolder`

Expected: exit 0 and refreshed JavaScript plus declaration output in `packages/scaffolder/dist`.

- [ ] **Step 7: Inspect generated output and repository diff**

Run: `git diff --check && git status --short && git diff --stat`

Expected: no whitespace errors; only scaffolder source, tests, fixtures, documentation, generated `dist`, and one changeset are changed.

- [ ] **Step 8: Commit documentation and release metadata**

```bash
git add packages/scaffolder/src/index.ts packages/scaffolder/docs/2-features.md packages/scaffolder/README.md packages/scaffolder/dist .changeset
git commit -m "Document JavaScript scaffolder extensions"
```

### Task 6: Final compatibility verification

**Files:**
- Verify only; modify the smallest responsible file if a check exposes a regression.

**Interfaces:**
- Consumes: all implementation tasks.
- Produces: fresh evidence that the completed package meets the spec without breaking the workspace.

- [ ] **Step 1: Run the complete scaffolder suite without cache reuse**

Run: `npm test --workspace=@alleyinteractive/scaffolder -- --runInBand --no-cache`

Expected: all suites and tests PASS with no unhandled promise rejections.

- [ ] **Step 2: Run package lint and build from current sources**

Run: `npm run lint --workspace=@alleyinteractive/scaffolder && npm run build --workspace=@alleyinteractive/scaffolder`

Expected: both commands exit 0; declaration generation validates the public contracts.

- [ ] **Step 3: Verify spec coverage in the final diff**

Run: `git diff HEAD~4 -- packages/scaffolder .changeset docs/superpowers`

Confirm the diff includes package discovery, single/array exports, both module formats, custom prompt definitions, direct resolved inputs, shared context, both YAML hooks, lifecycle errors, dry-run visibility, documentation, and backward-compatibility tests.

- [ ] **Step 4: Inspect final worktree state**

Run: `git status --short && git log -6 --oneline`

Expected: no uncommitted implementation files and a reviewable sequence of focused commits after the design and plan commits.

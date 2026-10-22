# JavaScript Scaffolder Extensions

## Summary

Extend `@alleyinteractive/scaffolder` so installed packages can provide features implemented in JavaScript rather than only YAML. JavaScript features can define their own prompts and generation logic. Existing YAML features can optionally run JavaScript before and after their normal generator.

This is a trusted-code extension mechanism. Extension modules execute in the scaffolder process with the same filesystem and process permissions as the user.

## Goals

- Discover custom scaffolder packages installed locally or globally.
- Allow a package to register one or more JavaScript features.
- Allow JavaScript features to collect custom input and perform arbitrary asynchronous generation.
- Allow a YAML feature to declare `beforeGenerate` and `afterGenerate` JavaScript hooks.
- Give both extension styles a consistent execution context.
- Preserve all existing YAML feature behavior.
- Document package authoring, YAML hooks, lifecycle order, dry runs, and security expectations.

## Non-goals

- Sandboxing or otherwise restricting third-party JavaScript.
- Installing extension packages on the user's behalf.
- Adding lifecycle stages beyond `beforeGenerate` and `afterGenerate`.
- Replacing the current YAML schema or built-in generators.
- Guaranteeing that arbitrary extension code honors dry-run mode.

## Package discovery

A package opts in with a `scaffolder` field in `package.json`:

```json
{
  "name": "@example/project-scaffolder",
  "scaffolder": "./scaffolder.js"
}
```

The feature store will search the same local and global `node_modules` roots it already uses for YAML feature packages. It will inspect package manifests at the unscoped and scoped package depths, resolve `scaffolder` relative to the manifest, and import the referenced module.

Discovery failures are isolated per package. A missing entry point, import failure, or invalid export emits a warning that identifies the package and does not prevent other features from loading.

The package module may default-export one feature or an array of features. CommonJS `module.exports` is also accepted because the runtime importer normalizes CommonJS and ES module namespaces.

## JavaScript feature contract

A JavaScript feature is an object with this shape:

```js
export default {
  name: 'post-type',
  description: 'Generate a WordPress post type',

  async prompts(context) {
    return [
      {
        name: 'slug',
        type: 'text',
        message: 'Post type slug',
      },
    ];
  },

  async generate(context) {
    // Generate or modify project files.
  },
};
```

`name` and `generate` are required. `description` and `prompts` are optional. `prompts` may return prompt definitions accepted by the `prompts` package or a resolved input object. Returning an input object allows an extension to implement its own interactive input flow. Prompt answers are merged into `context.inputs` before `generate` runs.

The feature picker and `--list` treat JavaScript and YAML features alike. Duplicate names retain the existing first-registration-wins behavior and warning.

## YAML lifecycle hooks

A YAML feature opts into hooks with a module path relative to its `config.yml`:

```yaml
name: Post Type
type: file
hooks: ./hooks.js
inputs:
  - name: slug
files:
  - source: post-type.stub
    destination: src/post-types/{{ inputs.slug }}.php
```

The hook module uses named exports:

```js
export async function beforeGenerate(context) {
  // Runs after YAML inputs are collected and before the built-in generator.
}

export async function afterGenerate(context) {
  // Runs after the built-in generator completes.
}
```

At least one supported hook must be exported. Unknown exports are ignored. A configured module that exports neither supported hook is invalid and fails that feature invocation with a descriptive error.

The lifecycle is:

1. Collect the inputs declared by YAML.
2. Create the shared context.
3. Run `beforeGenerate(context)` when exported.
4. Run the existing YAML generator.
5. Run `afterGenerate(context)` when exported.

Hooks may mutate `context.inputs`; changes made by `beforeGenerate` are available to templates and the built-in generator. The scaffolder keeps its generator input state synchronized with the context.

If a hook throws, execution stops. An error identifies the feature, hook stage, and hook module. `afterGenerate` does not run when either `beforeGenerate` or the built-in generator fails.

## Shared context

JavaScript features and YAML hooks receive the same context:

```js
{
  cwd,
  feature,
  inputs,
  dryRun,
  featureDirectory,
  resolveDestination(relativePath),
  logger,
}
```

- `cwd` is the directory in which scaffolder was invoked.
- `feature` contains the feature name and description.
- `inputs` is a mutable object containing resolved answers.
- `dryRun` reports whether `--dry-run` was passed.
- `featureDirectory` is the directory containing the YAML configuration or package entry point.
- `resolveDestination()` applies the same destination rules as built-in generators.
- `logger` is the initialized scaffolder logger.

The context is deliberately small. More filesystem abstractions or generator utilities can be added later without making them part of the initial API.

## Dry-run behavior

Hooks execute during a dry run so they can describe or calculate their intended work. The context exposes `dryRun`, and the documentation requires extension authors to avoid mutations when it is true. Arbitrary JavaScript cannot be forced to comply without sandboxing, which is outside this change.

The existing YAML generator continues to honor dry-run mode. A `beforeGenerate` hook still runs before that simulated generation, and `afterGenerate` runs afterward.

## Internal architecture

The feature store will hold a discriminated union rather than only `FeatureConfig`. YAML entries retain their configuration and directory. JavaScript entries retain their package metadata, entry-point directory, and callbacks. Prompt selection only relies on common `name` and `description` fields.

Invocation moves behind a common feature runner boundary:

- YAML runner: collect declared inputs, load optional hooks, and invoke the existing generator between lifecycle callbacks.
- JavaScript runner: invoke optional custom prompts, merge their answers, and invoke `generate`.

The existing generator classes remain responsible for YAML file, repository, and Composer generation. They expose context construction and destination resolution through the runner rather than being replaced.

Public TypeScript declarations for the feature and context contracts will be exported by the scaffolder package. Extension implementations remain ordinary JavaScript and do not require compilation.

## Validation and errors

Validation occurs at two points:

- Discovery validates package metadata and the JavaScript feature's common fields and callbacks.
- Invocation validates and imports a YAML hook module before running either hook or generation.

Warnings during package discovery do not abort store initialization. Errors for a selected feature do abort its invocation and flow through the scaffolder's existing error handling. Error messages include enough provenance to locate the package or hook file.

## Documentation

Update the scaffolder feature documentation with:

- A complete JavaScript package manifest and entry-point example.
- Single-feature and multiple-feature exports.
- Custom prompts and custom input collection.
- Shared context reference.
- A YAML feature with both lifecycle hooks.
- Lifecycle ordering and input mutation behavior.
- Dry-run responsibilities and an example guard.
- The trusted-code security warning.
- Error behavior and supported module formats.

The package README will link directly to the new JavaScript extension section.

## Testing

Tests will cover:

- Discovery of scoped and unscoped packages with a `scaffolder` manifest field.
- Loading single and multiple JavaScript feature exports.
- CommonJS and ES module export normalization.
- Isolation and warnings for missing, unimportable, and invalid extension modules.
- Inclusion of JavaScript features in listing and selection.
- Custom prompt answers reaching `generate`.
- A custom prompt callback returning its own input object.
- Shared context fields and destination resolution.
- YAML lifecycle ordering.
- Mutation of inputs in `beforeGenerate` reaching YAML templates and `afterGenerate`.
- Skipping `afterGenerate` after an earlier failure.
- Hook and custom feature behavior in dry-run mode.
- Backward compatibility for YAML features without hooks.

Implementation will follow test-driven development: each new behavior begins with a focused failing test, followed by the smallest production change that passes it.

## Compatibility

The new manifest and YAML fields are optional. Existing package layout discovery, YAML configurations, feature names, generators, CLI arguments, and destination behavior remain unchanged. No migration is required for current users.

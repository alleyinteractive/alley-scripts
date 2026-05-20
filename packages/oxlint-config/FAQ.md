# Frequently Asked Questions (FAQ)

## Is this linting config 1:1 replacement for `@alleyinteractive/eslint-config`?

No, this is not a 1:1 replacement. We have made some changes to the rules we enable and disable. We strived to make the transition as smooth as possible, but there are some minor differences.

## Does Oxlint lint CSS/SCSS?

No, Oxlint does not lint CSS/SCSS (Oxfmt can format CSS/SCSS files). For CSS linting, use [@alleyinteractive/stylelint-config](https://github.com/alleyinteractive/alley-scripts/tree/main/packages/stylelint-config).

## How can I migrate away from `@alleyinteractive/eslint-config`?

1. Replace `@alleyinteractive/eslint-config` with `@alleyinteractive/oxlint-config` in your `devDependencies`.
2. Delete `.eslintrc.json` / `.eslintrc.js`.
3. Create `oxlint.config.ts` extending the shared config.
4. Update your `lint` script from `eslint ...` to `oxlint -c oxlint.config.ts .`
5. Delete `tsconfig.eslint.json` if it only served ESLint's TypeScript parser

## Why should I use `.ts` extension for my config?

We recommend using `.ts` for better type safety, and it is easier to extend from our shared config.
The Oxfmt config does not support the `extends` property right now. There is movement to also remove the `extends` property from the Oxlint config, but that is still [in discussion](https://github.com/oxc-project/oxc/issues/16394).

So if all goes well, a `.ts` config is the future-proof option for both Oxlint and Oxfmt configs.

## Why are we bundling all linting rules together?

Our [@alleyinteractive/eslint-config](https://github.com/alleyinteractive/alley-scripts/tree/main/packages/eslint-config) exported ESLint configurations by "type". We approached this differently.
We have one package that exports both Oxlint and Oxfmt configurations. There is not a lot of performance gains by splitting the configurations into multiple "types".

## What is IDE support like?

For a list of supported IDEs, see this [page](https://oxc.rs/docs/guide/usage/linter/editors.html). I have found some issues with the [PHPStorm plugin](https://github.com/oxc-project/oxc-intellij-plugin/issues/436).
It's a new tool, so do not expect complete parity. If you run into any issues, please report them to the Oxc project.

## How can I browser all my Oxlint rules, categories, and plugins in the terminal?

See [oxlint-tui](https://npmx.dev/package/oxlint-tui).

## Why the TypeScript rules added manually?

`tsgolint` implements 59/61 typescript-eslint type-aware rules. And they are not added automatically (there are movement to allow this in oxlint). So we need to choose which rules
to add to our config.

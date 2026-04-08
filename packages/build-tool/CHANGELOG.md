# Changelog

## 0.3.0

### Minor Changes

- a01fe7b7: Bump @wordpress/scripts

## 0.2.2

### Patch Changes

- 3a40f53: Add ajv and ajv-keywords as dev dependencies. This fixes dependency issue when running the build
  tool via `npx`.

## 0.2.1

### Patch Changes

- a4a181b: Ensure that parent process exits with same code as child process

## 0.2.0

### Minor Changes

- 88bd605: Security patch: Bump form-data from 3.0.1 to 3.0.4

## 0.1.6

### Patch Changes

- daf4557: Fix ESM import types for Webpack configs.

## 0.1.5

### Patch Changes

- a7e32b5: Upgrading `@wordpress/scripts` to 6.7

## 0.1.4

### Patch Changes

- 9757983: Enhancing the extended webpack configuration support

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.1.4 -- @alleyinteractive/build-tool

- Updated README with new instructions for extending the webpack config.
- New file for passing the extended webpack config, containing the base config with the user config, to `wp-scripts`.
- Set the base config as a variable not a function.
- `getUserWebpackConfigFilePath` to get the user's `webpack.config.js` file path from the project root or with the `—config` arg.
- `getUserWebpackConfig` gets the user's webpack config object.
- `getWebpackConfig` updated to get the extended webpack config that contains the merged configuration from the build tool and the user's config.
- Added Jest unit tests for `getUserWebpackConfigFilePath` and `getUserWebpackConfig`.

## v0.1.3 -- @alleyinteractive/build-tool

- In the `tsconfig.esm.json` file, when `moduleResolution` is set to `NodeNext`, the `module` field must be set to `NodeNext` as well.
- Updated webpack and addressed TypeScript errors.

## v0.1.2 -- @alleyinteractive/build-tool

- Add exports for webpack config and update README with instructions on how to extend the config.

## v0.1.1 -- @alleyinteractive/build-tool

- Add `--webpack-blocks-only` that will disable the entries directory and only compile blocks set in the `blocks` directory.
- Update ESLint config to extend `@alleyinteractive/eslint-config/typescript` config.
- Add a `prepublishOnly` script to the `package.json` file to run `npm run build` before publishing.

## v0.1.0 -- @alleyinteractive/build-tool

- initial stable publication of Alley Build Tool.

## v0.0.2-beta -- @alleyinteractive/build-tool

- Add utils to published files.

## v0.0.1-beta -- @alleyinteractive/build-tool

- initial beta publication of Alley Build Tool.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.1.3 -- @alleyinteractive/build-tool

- In the `tsconfig.esm.json` file, when `moduleResolution` is set to `NodeNext` the `module` field must be set to `NodeNext` as well.
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

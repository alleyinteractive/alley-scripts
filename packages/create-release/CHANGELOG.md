# Changelog

## 0.4.0

### Minor Changes

- 633cf1dc: Prompt user to create a CHANGELOG entry when releasing. They can either provide it via CLI or have their default editor open to edit the changelog directly.

## 0.3.0

### Minor Changes

- 39a76a8: Adding force, adjusting logic to make console output more accurate.

## 0.2.0

### Minor Changes

- 88bd605: Security patch: Bump form-data from 3.0.1 to 3.0.4

## 0.1.5

### Patch Changes

- 7008656: - Ensure that the version can be changed under a variety of different of different formats.
  - Changes the default setting of the `--composer` and `--npm` flags to modify
    the plugin's `composer.json`/`package.json` files if the current version of
    the plugin is already set in the respective file.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.3

### Patch Changes

- 682b0a6: Only modify the plugin's header by default. Don't modify the `composer.json`/`package.json` version unless `--composer`/`--npm` is passed.

## 0.1.4

- Consolidated shared devDependencies into the root package.json file.

## 0.1.2

- No change, re-release with a license and README.

## 0.1.1 - 2023-09-19

- No change, re-release with a license and README.

## 0.1.0 - 2023-09-19

- Initial release.

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.5.0

- Dependencies of `block-editor-tools` that are added as externals using the WordPress Dependency Extraction Webpack Plugin were moved to `devDependencies` to avoid peer dependency downloads.
- The ESLint rule import/no-extraneous-dependencies was turned off as it requesting that the externalized packages be moved to dependencies.
- Additional exports were created for importing specific scripts from this plugin:
  * `/hooks` - For using any of the hooks available.
  * `/components` - For using any of the components available.
  * `/services` - For using any of the service functions.
- The `tsconfig` file was split for ESLint specific configuration to allow for TS linting.
- Dependency Extraction Webpack Plugin was missing the options parameter.
- The `combineAssets` was set to true for Dependency Extraction Webpack Plugin to reduce the number of built files.
- Some shared devDependencies were moved to the root `package.json`.
- Moved changelog from the README to the CHANGELOG.md file to match the pattern of adjacent packages.

## v0.4.1

- Remove `lodash` as dependency from `block-editor-tools` package.

## v0.4.0

- Reduce the number of `@wordpress/*` dependencies that are not used directly by this package.

## v0.3.8

- Use of `decodeEntities` in `<PostPicker>` component search results.

## v0.3.7

- added `useCurrentPostId` hook.

## v0.3.0

- added `<PostPicker>` component and `usePostById` hook.

## v0.2.0

- Upgraded to WordPress 6.2

## v0.1.2

- Added Node 16 support back.

## v0.1.0

- Addition of Eslint configuration and rules.
- Make peer dependency requirements lenient.
- Add Styleint config.
- Include Typescript types.

## v0.0.1

- Initial release

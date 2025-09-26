# Changelog

## 0.14.0

### Minor Changes

- dbe18ee: Update TermSelector component to use FormTokenField
- b9ce351: Adds filters prop to PostSelector to allow custom filters or instructions in the modal.

## 0.13.2

### Patch Changes

- b98204b: Export missing useBlockName and useParentClientId hooks.

## 0.13.1

### Patch Changes

- ef73f89: Drop Node 16 support.
- e2235d7: Deprecate useDebounce in favor of the version in @wordpress/compose.
- 244a618: Add Node 24 support

## 0.13.0

### Minor Changes

- 88bd605: Security patch: Bump form-data from 3.0.1 to 3.0.4

## 0.12.2

### Patch Changes

- c35bdd4: Convert PostPicker styles to styled components
- 5985d15: Convert TermSelector to TypeScript

## 0.12.1

### Patch Changes

- 0022bb9: Memoize functions returned by hooks

## 0.12.0

### Minor Changes

- df2e0f2: Add list view option to PostPicker component

## 0.11.0

### Minor Changes

- 2900b04: Extending support for Node 22.

## 0.10.3

### Patch Changes

- 2ada8ed: Improve stability of usePostMeta hooks

## 0.10.2

### Patch Changes

- eb6e2dc: Hard code all references to the core-data store.

## 0.10.1

### Patch Changes

- 2dad703: Switch usePost back to core store to fix error in wp-curate

## 0.10.0

### Minor Changes

- 0138b99: Introducing new hooks

### Patch Changes

- 0390423: Feature: Allow override of post preview lookup function in PostPicker.

## 0.9.0

### Minor Changes

- 3ad4c4e: Updated `usePostById` and `usePost` to allow overriding context value for `getEntityRecord`

## 0.8.0

### Minor Changes

- fb51636: Adds Sortable and SortableItem components

## 0.7.0

### Minor Changes

- 37ff706: Adds a useOption hook for reading/writing options

### Patch Changes

- 89a2447: Move away from wordpress/element to React

## 0.6.4

### Patch Changes

- 840ec15: Reduces the time usePostById returns undefined while looking up the post type.

## 0.6.3

### Patch Changes

- 8b21cc1: - Bug Fix: Post Picker causes all Block Editor modals to be too wide

## 0.6.2

### Patch Changes

- 7086f9d: Bug fix: a previously selected post that has been unpublished or deleted will no longer crash the `usePostById` hook or the `PostPicker` component.

## 0.6.1

### Patch Changes

- 931181d: Updated README that documents components, hooks, and services usage.

## 0.6.0

### Minor Changes

- cb1a57f: Extending support for Node 20.

## 0.5.1

### Patch Changes

- 4690cc8: Ensure that TypeScript types are generated for the package.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## v0.5.0

- Dependencies of `block-editor-tools` that are added as externals using the WordPress Dependency Extraction Webpack Plugin were moved to `devDependencies` to avoid peer dependency downloads.
  The ESLint rule import/no-extraneous-dependencies was turned off as it requested that the externalized packages be moved to dependencies.
- Additional exports were created for importing specific scripts from this plugin:
  - `/hooks` - For using any of the hooks available.
  - `/components` - For using any of the components available.
  - `/services` - For using any of the service functions.
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

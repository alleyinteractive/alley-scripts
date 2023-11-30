# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.1 - 2023-11-20

- Remove `"module": "node16"` from `tsconfig.json` to inherit the default value of `"module": "esnext"`.

## 0.1.0 - 2023-10-11

- Update script name to `alley-create-block`.
- Add `@wordpress/create-block` as peer dependency.
- Use `wp-create-block` when spawning the `@wordpress/create-block` process.

## 0.0.3 - 2023-08-17

- Bugfix: Remove dependency on `chalk`, which was bumped to v5 by Dependabot, and is not compatible with TypeScript.

## 0.0.2 - 2023-08-16

- Simplify `registerBlockType` function calls to pull all metadata from block.json and prevent the need for updating
  certain types of metadata (like apiVersion) in multiple places.

## 0.0.1 - 2023-05-30

- Initial version. Contains JavaScript and TypeScript variants.

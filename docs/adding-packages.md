# Adding and Managing Packages

This project uses [Turborepo](https://turbo.build/repo/docs) with NPM to add and manage packages in this monorepo.

> **NOTE**: If the workspace is to be created in a location other than the default `packages` directory, the path to the directory needs to be provided in the root `package.json` workspaces configuration.

## Scaffold a new package

```sh
npx turbo gen workspace --type package
```

The command above will walk through some prompts and create a new package in the `packages` directory with a basic `package.json` and `README.md` file.

> **NOTE**: The `package.json` file will be scaffolded with the `private` configuration set to `true`. When the package is ready to be published to the public registry, this configuration should be removed.

For more information on Turborepo code generation, see the [Turborepo Code Generation documentation](https://turbo.build/repo/docs/core-concepts/monorepos/code-generation).

## Add a package manually

To add a package manually, create a new directory with the same name as the package in the `packages` directory and add a `package.json` file with the following content:

```json
{
  "name": "@alleyinteractive/package-name",
  "version": "0.0.0",
  "license": "GPL-2.0-or-later"
}
```

# Alley Scripts

A collection of scripts and utilities built by [Alley Interactive](https://alley.com)
for projects to speed up development.

## Table of Contents

- [Packages](#packages)
- [Adding and Managing Packages](#adding-and-managing-packages)
- [Versioning and Publishing Packages in this Monorepo](##versioning-and-publishing-packages-in-this-monorepo)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [Maintainers](#maintainers)
- [License](#license)

## Packages

This monorepo contains the following packages:

- [`@alleyinteractive/block-editor-tools`](./packages/block-editor-tools/README.md)
- [`@alleyinteractive/build-tool`](./packages/build-tool/README.md)
- [`@alleyinteractive/create-block`](./packages/create-block/README.md)
- [`@alleyinteractive/create-entry`](./packages/create-entry/README.md)
- [`@alleyinteractive/create-release`](./packages/create-release/README.md)
- [`@alleyinteractive/eslint-config`](./packages/eslint-config/README.md)
- [`@alleyinteractive/scaffolder`](./packages/scaffolder/README.md)
- [`@alleyinteractive/stylelint-config`](./packages/stylelint-config/README.md)
- [`@alleyinteractive/tsconfig`](./packages/tsconfig/README.md)

## Adding and Managing Packages

This project uses [Turborepo](https://turbo.build/repo/docs) with NPM to add and manage packages in this monorepo. To add a new package, you can add the package manually or run a command.

**NOTE**: _If the workspace is to be created in a location other than the default `packages` directory, the path to the directory needs to be provided in the root `package.json` workspaces configuration._

### Scaffold a new package

```sh
npx turbo gen workspace --type package
```

The command above will walk through some prompts and create a new package in the `packages` directory with a basic `package.json` and `README.md` file.

**NOTE**: _The `package.json` file will be scaffolded with the `private` configuration set to `true`. When the package is ready to be published to the public registry, this configuration should be removed._

For more information on the `Turborepo` code generation, see the [Turborepo Code Generation documentation](https://turbo.build/repo/docs/core-concepts/monorepos/code-generation).

### Add a package manually

To add a package manually you can create a new directory with the same name as the package in the `packages` directory and add a `package.json` file with the following content:

```json
{
  "name": "@alleyinteractive/package-name",
  "version": "0.0.0",
  "license": "GPL-2.0-or-later",
}
```

## Versioning and Publishing Packages in this Monorepo

This project uses the [Changesets CLI](https://github.com/changesets/changesets) to manage versioning and publishing of packages in this monorepo. To release a new version of a package that you are working on, you can run the following command:

```sh
npx changeset
```

The command above will walk through some prompts and create a new changeset file in the `.changeset` directory. Commit this file to version control in your feature branch and open a pull request.

Once the pull request is approved, merge the branch into the `main` branch. The changeset Github actions will automatically create a new branch, e.g. `changeset-release/main` and pull request titled "Version Packages". Once you are ready to release the package merge the pull request. You may need to check with other developers releasing versions for other packages as the changeset release will add all changes to that pull request. Once the `changeset-release/main` branch is merged it will publish the new version of the package to the NPM registry.

**You do not need to manually bump the version of the package in the `package.json` file. The changeset Github actions will handle this for you.**

## Changelog

Each package/workspace contains a changelog file that documents the changes for each version of the package. The changelog file is located in the root of the package directory and is named `CHANGELOG.md`.

## Contributing

Feel free to dive in! [Open an issue](https://github.com/alleyinteractive/alley-scripts/issues/new/choose) or [submit PRs](https://github.com/alleyinteractive/alley-scripts/compare). Standard Readme follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/1/3/0/code-of-conduct/).

## Maintainers

This project is actively maintained by [Alley
Interactive](https://github.com/alleyinteractive). Like what you see? [Come work
with us](https://alley.com/careers/).

- [All Contributors](../../contributors)

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)

## License

The GNU General Public License (GPL) license. Please see [License File](LICENSE) for more information.

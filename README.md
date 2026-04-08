# Alley Scripts

A collection of scripts and utilities built by [Alley Interactive](https://alley.com)
for projects to speed up development.

## Table of Contents

- [Packages](#packages)
- [Adding and Managing Packages](#adding-and-managing-packages)
- [Versioning and Publishing Packages in this Monorepo](#versioning-and-publishing-packages-in-this-monorepo)
- [Snapshot Releases](#snapshot-releases)
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
- [`@alleyinteractive/oxlint-config`](./packages/oxlint-config/README.md)
- [`@alleyinteractive/scaffolder-features`](./packages/scaffolder-features/README.md)
- [`@alleyinteractive/scaffolder`](./packages/scaffolder/README.md)
- [`@alleyinteractive/stylelint-config`](./packages/stylelint-config/README.md)
- [`@alleyinteractive/tsconfig`](./packages/tsconfig/README.md)

## Adding and Managing Packages

This project uses [Turborepo](https://turbo.build/repo/docs) with NPM to manage packages in this monorepo. See [docs/adding-packages.md](./docs/adding-packages.md) for full instructions on scaffolding or manually adding a package.

## Versioning and Publishing Packages in this Monorepo

This project uses the [Changesets CLI](https://github.com/changesets/changesets) and npm [Trusted Publishers](https://docs.npmjs.com/trusted-publishers#for-github-actions) (OIDC) to manage versioning and publishing. See [docs/versioning-publishing.md](./docs/versioning-publishing.md) for the full workflow and Trusted Publisher setup.

## Snapshot Releases

Snapshot releases let you publish pre-release test versions (e.g. `0.0.0-fix-ajv-20250929142301`) without affecting the `latest` tag. See [docs/snapshot-releases.md](./docs/snapshot-releases.md) for full instructions.

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

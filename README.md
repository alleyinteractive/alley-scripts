# Alley Scripts

A collection of scripts and utilities built by [Alley Interactive](https://alley.com)
for projects to speed up development.

## Table of Contents

- [Packages](#packages)
- [Adding and Managing Packages](#adding-and-managing-packages)
- [Versioning and Publishing Packages in this Monorepo](##versioning-and-publishing-packages-in-this-monorepo)
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
- [`@alleyinteractive/scaffolder`](./packages/scaffolder/README.md)
- [`@alleyinteractive/scaffolder-features`](./packages/scaffolder-features/README.md)
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

This project uses the [Changesets CLI](https://github.com/changesets/changesets) to manage versioning and publishing of packages in this monorepo.

It is recommended to create a changeset for each feature or bug fix that is added to a package. This will help keep track of changes and ensure that the version of the package is updated correctly.

To create a changeset, run the following command in the root of the monorepo:

```sh
npm run changeset
```
The command above will walk through some prompts and create a new changeset file in the `.changeset` directory. Commit this file to version control in your feature branch and open a pull request.

## Example Workflow
1. Create a new branch from `main` for the feature you are working on.
2. Make changes to the package and commit them to the branch.
3. Create a pull request and request a review.
4. Once approved, create a changeset by running `npm run changeset` and commit the changeset file to your feature branch.
5. Merge the feature branch into `main`.

Once merged into the `main` branch, the changeset Github action will automatically create a new branch, e.g. `changeset-release/main` and pull request titled "Version Packages". A new version of this package is not published until this pull request is merged.

**You do not need to manually bump the version of the package in the `package.json` file. The changeset Github actions will handle this for you.**

## Snapshot Releases

> [!NOTE]
> With the migration to [Trusted Publishers and other changes at GitHub/NPM](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/)
> the snapshot release workflow may not work in the future.

Snapshot releases allow you to create and test pre-release versions of packages without affecting the main release workflow. These are useful for testing bug fixes, new features, or dependency updates before cutting an official release.

### What are Snapshot Releases?

Snapshot releases create versions with the format `0.0.0-{tag}-DATETIMESTAMP` that are intended for testing purposes only. They are published with a custom npm tag to avoid interfering with the `latest` tag that users install by default.

### When to Use Snapshot Releases

- **Testing Bug Fixes**: Test dependency fixes or critical bug fixes before official release
- **Feature Development**: Test new features in real projects before merging to main
- **Dependency Updates**: Verify that dependency updates don't break downstream projects
- **Cross-Package Testing**: Test changes that affect multiple packages in the monorepo

### Requirements

1. **Branch Naming**: Your branch must start with `snapshot/`
   - ✅ `snapshot/fix-ajv-deps`
   - ✅ `snapshot/test-new-feature`
   - ❌ `feature/fix-ajv` (will be rejected)

2. **GitHub Permissions**: You need write access to the repository to trigger the workflow

3. **Changes**: Your snapshot branch should contain the changes you want to test

### How to Create a Snapshot Release

1. **Create a snapshot branch**:
   ```bash
   git checkout -b snapshot/fix-build-tool-deps
   # Make your changes
   git add .
   git commit -m "Fix ajv dependency conflict in build-tool"
   git push origin snapshot/fix-build-tool-deps
   ```

2. **Trigger the snapshot workflow**:
   - Go to the **Actions** tab in GitHub
   - Click on **"Snapshot Release"** workflow
   - Click **"Run workflow"**
   - Select your `snapshot/` branch from the dropdown
   - Enter a descriptive **tag slug** (e.g., `fix-ajv`, `test-feature`)
   - Optionally select a specific **package** to snapshot (or leave empty for all changed packages)
   - Click **"Run workflow"**

3. **Test the snapshot**:
   ```bash
   # Install the snapshot version
   npm install @alleyinteractive/build-tool@fix-ajv

   # Test your changes
   npm run build
   ```

4. **Clean up** (after testing):
   ```bash
   # Remove snapshot version and reinstall latest
   npm uninstall @alleyinteractive/build-tool
   npm install @alleyinteractive/build-tool@latest

   # Delete the snapshot branch (optional)
   git branch -D snapshot/fix-build-tool-deps
   git push origin --delete snapshot/fix-build-tool-deps
   ```

### Snapshot Workflow Parameters

- **Tag**: A descriptive slug for your snapshot (required)
  - Examples: `fix-ajv`, `test-webpack-config`, `debug-build`
  - Will create versions like: `0.2.3-fix-ajv-20250929142301`

- **Package**: Choose which package to snapshot (optional)
  - Leave empty to snapshot all packages with changes
  - Select specific package to snapshot only that package
  - Available options: `build-tool`, `eslint-config`, `create-block`, etc.

### Best Practices

- **Use descriptive tag names** that clearly indicate what you're testing
- **Test thoroughly** before creating an official release
- **Don't merge snapshot branches** to main - they're for testing only
- **Clean up snapshot branches** after testing is complete
- **Use snapshots sparingly** - they're for testing, not regular development

## Trusted Publishers

This repository uses NPM's [Trusted Publishers](https://docs.npmjs.com/trusted-publishers#for-github-actions)
feature to publish to NPM. Please ensure that any newly created packages are
properly configured to use the `release.yml` GitHub action for publishing.

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

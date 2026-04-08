# Versioning and Publishing Packages

This project uses the [Changesets CLI](https://github.com/changesets/changesets) to manage versioning and publishing of packages in this monorepo.

## Creating a Changeset

It is recommended to create a changeset for each feature or bug fix added to a package. This keeps track of changes and ensures that package versions are updated correctly.

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

Once merged into the `main` branch, the changeset GitHub action will automatically create a new branch (e.g. `changeset-release/main`) and a pull request titled "Version Packages". A new version of the package is not published until that pull request is merged.

**You do not need to manually bump the version of the package in the `package.json` file. The changeset GitHub actions will handle this for you.**

## Trusted Publishers

This repository uses npm's [Trusted Publishers](https://docs.npmjs.com/trusted-publishers#for-github-actions) feature (OIDC) to publish to npm, eliminating the need for long-lived token secrets. When a publish step runs, npm automatically exchanges the GitHub OIDC token for a short-lived npm token — no `NPM_TOKEN` or `NODE_AUTH_TOKEN` secret is stored or required.

### Workflow requirements

Both publishing workflows are already configured correctly:

| Workflow | `id-token: write` | `registry-url` in `setup-node` |
|---|---|---|
| `release.yml` | yes | yes |
| `snapshot-release.yml` | yes | yes |

### Configuring Trusted Publishers on npmjs.com

Each workflow that publishes needs its own trusted publisher entry. This can be done **per-package** or once at the **`@alleyinteractive` org level** (recommended, applies to all packages).

To configure at the org level: go to the `@alleyinteractive` org page on npmjs.com → **Settings** → **Trusted Publishers** → add two entries:

| Field | Entry 1 | Entry 2 |
|---|---|---|
| Repository owner | `alleyinteractive` | `alleyinteractive` |
| Repository name | `alley-scripts` | `alley-scripts` |
| Workflow filename | `release.yml` | `snapshot-release.yml` |
| Environment | *(blank)* | *(blank)* |

To configure per-package instead: go to the package page on npmjs.com → **Settings** → **Publishing** → **Trusted Publishers** and add the same two entries above.

> **When adding a new package**, ensure it either inherits org-level Trusted Publisher config or has both entries added manually before its first publish.

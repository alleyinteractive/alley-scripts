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

The publishing workflow is configured correctly:

| Workflow      | Jobs                  | `id-token: write` | `registry-url` in `setup-node` |
|---------------|-----------------------|-------------------|--------------------------------|
| `release.yml` | `release`, `snapshot` | yes               | yes                            |

### Configuring Trusted Publishers on npmjs.com

Only one trusted publisher entry is needed — both the `release` and `snapshot` jobs live in `release.yml`. This can be done **per-package**.

To configure per-package instead: go to the package page on npmjs.com → **Settings** → **Publishing** → **Trusted Publishers** and add the same entry above.

| Field             | Value              |
|-------------------|--------------------|
| Repository owner  | `alleyinteractive` |
| Repository name   | `alley-scripts`    |
| Workflow filename | `release.yml`      |
| Environment       | *(blank)*          |

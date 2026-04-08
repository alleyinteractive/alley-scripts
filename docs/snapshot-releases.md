# Snapshot Releases

Snapshot releases allow you to create and test pre-release versions of packages without affecting the main release workflow. These are useful for testing bug fixes, new features, or dependency updates before cutting an official release.

## What are Snapshot Releases?

Snapshot releases create versions with the format `0.0.0-{tag}-DATETIMESTAMP` that are intended for testing purposes only. They are published with a custom npm tag to avoid interfering with the `latest` tag that users install by default.

## When to Use Snapshot Releases

- **Testing Bug Fixes**: Test dependency fixes or critical bug fixes before official release
- **Feature Development**: Test new features in real projects before merging to main
- **Dependency Updates**: Verify that dependency updates don't break downstream projects
- **Cross-Package Testing**: Test changes that affect multiple packages in the monorepo

## Requirements

1. **Branch Naming**: Your branch must start with `snapshot/`
   - ✅ `snapshot/fix-ajv-deps`
   - ✅ `snapshot/test-new-feature`
   - ❌ `feature/fix-ajv` (will be rejected)

2. **GitHub Permissions**: You need write access to the repository to trigger the workflow.

3. **Changeset**: At least one [changeset](./versioning-publishing.md) must exist for the packages you want to snapshot. Run `npm run changeset` on your branch before triggering the workflow.

4. **Trusted Publisher**: The `snapshot-release.yml` workflow must be configured as a Trusted Publisher on npmjs.com alongside `release.yml`. See [Versioning and Publishing § Trusted Publishers](./versioning-publishing.md#trusted-publishers) for setup steps.

## How to Create a Snapshot Release

1. **Create a snapshot branch and add a changeset**:
   ```bash
   git checkout -b snapshot/fix-build-tool-deps
   # Make your changes
   git add .
   git commit -m "Fix ajv dependency conflict in build-tool"
   npm run changeset   # select affected packages and describe the change
   git add .changeset
   git commit -m "Add changeset"
   git push origin snapshot/fix-build-tool-deps
   ```

2. **Trigger the snapshot workflow**:
   - Go to the **Actions** tab in GitHub
   - Click on **"Snapshot Release"** workflow
   - Click **"Run workflow"**
   - Select your `snapshot/` branch from the dropdown
   - Enter a descriptive **tag slug** (e.g., `fix-ajv`, `test-feature`)
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

## Workflow Parameters

| Parameter | Required | Description |
|-----------|----------|-------------|
| `tag` | Yes | A descriptive slug for your snapshot (e.g. `fix-ajv`, `test-webpack-config`). Creates versions like `0.2.3-fix-ajv-20250929142301`. |

## Best Practices

- **Use descriptive tag names** that clearly indicate what you're testing
- **Test thoroughly** before creating an official release
- **Don't merge snapshot branches** to main — they're for testing only
- **Clean up snapshot branches** after testing is complete
- **Use snapshots sparingly** — they're for testing, not regular development

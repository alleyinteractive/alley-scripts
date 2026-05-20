# Alley Scripts Demo Plugin

This is a demo plugin for Alley Scripts. It is meant to be used in development and to
demo the functionality of the packages in alley-scripts.

The plugin adds components included in the Monorepo to a Gutenberg sidebar. It is not meant to
be used in production.

## Installation

1. Clone the `alley-scripts` repository to your `plugins` directory in your local WordPress installation.
2. Use Node `24` (`nvm use` from the repository root will pick this up from `.nvmrc`), then run `npm ci` in the `alley-scripts` directory.
3. Run `npm run build` from the repository root to build the workspaces and the demo plugin.
3. Activate the plugin in your WordPress installation to see the components in the Gutenberg sidebar.

## Development for block editor tools with fast refresh.
To develop the plugin and see changes in real-time:
1. Install the latest version of WordPress and the [Gutenberg plugin](https://wordpress.org/plugins/gutenberg/) in your local environment.
2. Ensure that `define( 'SCRIPT_DEBUG', true );` is defined in your `wp-config.php` file.
3. If you make changes in `packages/build-tool`, rebuild that workspace from the repository root with `npm run build --workspace=@alleyinteractive/build-tool`.
4. Run `npm run start:hot` in the `alley-scripts/plugin` directory. This will build the local `@alleyinteractive/build-tool`, start the webpack dev server, and watch for changes in the demo plugin and imported package source files.

Because the demo slotfill imports `@alleyinteractive/block-editor-tools` from a relative source path, changes made in `packages/block-editor-tools/src` are picked up by the hot-reload workflow without rebuilding the package first.

If you want to refresh the plugin's WordPress package versions for a new core release, run:

```sh
npm run packages-update -- --dist-tag=latest
```

Then re-run the plugin lint/build/test commands and verify the plugin against the latest WordPress release you are targeting.

## Included examples

The demo plugin currently exposes working examples for:

- `AudioPicker`
- `Checkboxes`
- `CSVUploader`
- `ImagePicker`
- `MediaPicker`
- `PostPicker` (grid and list modes)
- `PostSelector`
- `Sortable` / `SortableItem`
- `TermSelector`
- `usePostMeta`

### Testing new features in the alley scripts plugin
If you want to test any new components or hooks in a block in the plugin you can scaffold a new block, entry, or slotfill in the `alley-scripts/plugin` directory.
To test the new feature with fast refresh, be sure to import the scripts using a _relative path_ so that the development server can watch for changes. You may need to disable the [ESLint no relative packages rule (`import/no-relative-packages`)](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md) to allow linting to pass. Follow the instructions above to see the changes apply in real time in the editor.

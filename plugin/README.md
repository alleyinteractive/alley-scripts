# Alley Scripts Demo Plugin

This is a demo plugin for Alley Scripts. It is meant to be used in development and to
demo the functionality of the packages in alley-scripts.

The plugin adds components included in the Monorepo to a Gutenberg sidebar. It is not meant to
be used in production.

## Installation

1. Clone the `alley-scripts` repository to your `plugins` directory in your local WordPress installation.
2. Run `npm install` in the `alley-scripts` directory. Then run `npm run build` to build the plugin.
3. Activate the plugin in your WordPress installation to see the components in the Gutenberg sidebar.

## Development for block editor tools with fast refresh.
To develop the plugin and see changes in real-time:
1. Install the Gutenberg plugin in your WordPress installation.
2. Ensure that `define( 'SCRIPT_DEBUG', true );` is defined in your `wp-config.php` file.
1. Run `npm run start:hot` in the `alley-scripts/plugin` directory. This will start a development server and watch for changes in the block-editor-tools package files.

### Testing new features in the alley scripts plugin
If you want to test any new components or hooks in a block in the plugin you can scaffold a new block, entry, or slotfill in the `alley-scripts/plugin` directory.
To test the new feature with fast refresh, be sure to import the scripts using a _relative path_ so that the development server can watch for changes. You may need to disable the [ESLint no relative packages rule (`import/no-relative-packages`)](https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-relative-packages.md) to allow linting to pass. Follow the instructions above to see the changes apply in real time in the editor.

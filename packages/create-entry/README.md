# Create Entry Point

[![standard README badge](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Alley's create entry point script is a tool to scaffold entry points and slotfills for projects that use `@wordpress/scripts` for the build system. At a minimum, it generates a JS file for the entry point or slotfill. It also generates an optional CSS file, and a PHP file for enqueueing the entry point with WordPress script registration and enqueues.

This script was written to pair with the [Create WordPress Plugin](https://github.com/alleyinteractive/create-wordpress-plugin) but can easily adopt to other projects which use `@wordpress/scripts`. It was inspired by the [Create Block tool](https://www.npmjs.com/package/@wordpress/create-block) and customized to serve different use cases for scaffolding scripts.

The entry point script, styles, and enqueue are completely encapsulated in a directory improving the experience of maintaining the entry point feature.

> _This script requires the use of `@wordpress/scripts` in your project._

### Use

Install the package from npm:

```sh
npm install --save-dev @alleyinteractive/create-entry
```

Run the script to generate an entry point:

```sh
$ npx create-entry [options]
```
Without providing any options the tool will prompt the user through several options for creating an entry.

### `CLI options`


```bash
--slotfill                   Scaffold a slotfill type entry point.
--src-dir=<value>            Directory in which the entry point will be scaffolded. (default is 'entries')
--namespace=<value>          Internal namespace for the entry point. (default is 'create-entry')
--textdomain=<value>         Text domain for setting translated strings for a script. (default is empty or 'default')
```

### Prompt options
The script will run and will start prompting for the input required to scaffold the entry point.

#### slug
The slug is the name of the entry point. It also is used:
* as the entry point slug (required for its identification)
* as the output location (folder name) for scaffolded files

#### (Optional) Including a stylesheet
This prompt allows the user to opt-in to scaffolding a `.scss` file in the entry point.

#### (Optional) Including a PHP file for enqueueing the entry script and optional stylesheet.
The default option is to include the PHP file for enqueueing the entry, this can be opted out of. The generated file will contain WordPress enqueue hooks and functions to enqueue the entry point assets.

#### `--namespace`
If the PHP file is included an optional namespace prompt is provided if the user would like to customize the namespace. Default is 'create-entry'. If the CLI option is provided this prompt will not show as the namespace has already been set.

### Recommended Setup
* Install `create-entry` as a dev dependency on a project.
* Add a `create-entry` script command in the projects `package.json` file to call the script.
* Add project specific flags to the command setting `--src-dir`, `--namespace`, and `--textdomain` accordingly.
* Add a separate `create-slotfill` script command in the projects `package.json` file with the necessary flags to scaffold a slotfill entry point.

Example: 
```json
// package.json
"scripts": {
    "create-entry": "create-entry --src-dir=src --namespace=create-wordpress-plugin --textdomain=mytextdomain",
    "create-slotfill": "create-entry --slotfill --src-dir=src --namespace=create-wordpress-plugin --textdomain=mytextdomain",
}
```
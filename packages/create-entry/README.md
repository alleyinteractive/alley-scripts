# Create Entry Point

[![standard README badge](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Alley's create entry point script is a tool to scaffold entry points and slotfills for projects that use [`@wordpress/scripts`](https://www.npmjs.com/package/@wordpress/scripts) for the build system. At a minimum, it generates a TS file for the entry point or slotfill. It also generates an optional CSS file, and a PHP file for enqueueing the entry point with WordPress script registration and enqueues.

This script was written to pair with the [Create WordPress Plugin](https://github.com/alleyinteractive/create-wordpress-plugin) but can easily adopt to other projects which use `@wordpress/scripts`. It was inspired by the [Create Block tool](https://www.npmjs.com/package/@wordpress/create-block) and customized to serve different use cases for scaffolding scripts.

The entry point script, styles, and enqueue are completely encapsulated in a directory improving the experience of maintaining the entry point feature.

> _This script requires the use of `@wordpress/scripts` in your project. All generated script files will be Typescript or `.ts` files. If your project doesn't support Typescript you can change the `.ts` extension to a `.js` extension._

### Use

Install the package from npm:

```sh
npm install --save-dev @alleyinteractive/create-entry
```

Run the script to generate an entry point:

```sh
$ npx @alleyinteractive/create-entry [options]
```
Without providing any options the tool will prompt the user through several options for creating an entry.

### `CLI options`

```

  --src-dir string          The directory where the entry points will be written relative to  
                            the current working directory. (default is "entries")             
  -h, --help                Prints this usage guide                                           
  -n, --namespace string    Internal namespace for the entry point. (default is "create-      
                            entry")                                                           
  -s, --slotfill            Text domain for setting translated strings for a script. (default 
                            is empty or "default")                                            
  -t, --textdomain string   Text domain for setting translated strings for a script. (default 
                            is empty or "default")    
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

#### Namespace
If the PHP file is included an optional namespace prompt is provided if the user would like to customize the namespace. Default is 'create-entry'. If the CLI `--namespace` option is provided this prompt will not show as the namespace has already been set.

### Recommended Setup
* Install `create-entry` as a dev dependency on a project. e.g. `npm install --save-dev @alleyinteractive/create-entry`
* Add a `create-entry` script command in the projects `package.json` file to call the script.
* Add project specific flags to the command setting `--src-dir`, `--namespace`, and `--textdomain` accordingly.
* Add a separate `create-slotfill` script command in the projects `package.json` file with the necessary flags to scaffold a slotfill entry point.

Example: 
```json
// package.json
"scripts": {
    "create-entry": "npx @alleyinteractive/create-entry --src-dir=src --namespace=create-wordpress-plugin --textdomain=mytextdomain",
    "create-slotfill": "npx @alleyinteractive/create-entry --slotfill --src-dir=src --namespace=create-wordpress-plugin --textdomain=mytextdomain",
}
```

#### Including the entry points PHP file
In order for the entry point to be registered in WordPress using the generated PHP file, it will need to be included in a project. [`@wordpress/scripts`](https://www.npmjs.com/package/@wordpress/scripts) will copy the PHP file to the build directory so it will need to be included from there.

Lets assume the Webpack output directory is named `build`. This will be where the entry points should be included from.

Example:
```php
// plugin.php located in the project root.
if ( file_exists( __DIR__ . '/build/entry-point-slug/index.php' ) ) {
	require_once __DIR__ . '/build/entry-point-slug/index.php';
}
```

Another way would be to autoload all `index.php` files for each entry from the build directory:

```php
$files = glob( __DIR__ . '/build/**/index.php' );

if ( ! empty( $files ) ) {
    foreach ( $files as $path ) {
        if ( 0 === validate_file( $path ) && file_exists( $path ) ) {
            require_once $path;
        }
    }
}
```

### From Source

This project was written as a Node application with ESM and Typescript support. This project uses Alley's ESLint Typescript configuration that extends Airbnb's ESLint standards.

To work on this repository:

```sh
git clone git@github.com:alleyinteractive/alley-scripts.git
cd packages/create-entry
npm ci
```

In order to test the config with another project, you will need to point to this package, e.g.:

```json
{
  "devDependences": {
    "@alleyinteractive/create-entry": "file:../path/to/alley-scripts/packages/create-entry"
  }
}
```

Then simply run `npm install` and npm will symlink to this folder, and you can work on your changes.


### Changelog

This project keeps a [changelog](CHANGELOG.md).


## Development Process

See instructions above on installing from source. Pull requests are welcome from the community and will be considered
for inclusion. Releases follow semantic versioning and are shipped on an as-needed basis.


### Contributing

See [our contributor guidelines](../../CONTRIBUTING.md) for instructions on how to
contribute to this open source project.


## Project Structure

This is an npm package that is published to https://www.npmjs.com/. Dependencies are defined in `package.json` and the
ESLint configuration is found in `.eslintrc.json`.
Typescript configuration is found in `tsconfig.json`.


## Third-Party Dependencies

Third party dependencies are managed by `npm` and are visible in `package.json`. This package intends to reduce the
dependency load on projects that use it by managing the dependencies itself.


## Related Efforts

- [ESLint](https://eslint.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Airbnb's ESLint Standards](https://github.com/airbnb/javascript)
- [typescript-eslint](https://typescript-eslint.io/)
- [Create Block](https://www.npmjs.com/package/@wordpress/create-block)
- [WordPress Scripts](https://www.npmjs.com/package/@wordpress/scripts)



## Maintainers

- [Alley](https://github.com/alleyinteractive)

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)


### Contributors

Thanks to all of the [contributors](../../CONTRIBUTORS.md) to this project.


## License

This project is licensed under the
[GNU Public License (GPL) version 2](LICENSE) or later.

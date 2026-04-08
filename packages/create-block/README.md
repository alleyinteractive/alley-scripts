# Alley Create Block

[![standard README badge](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Alley's ["external template" for `@wordpress/create-block`](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#external-project-templates) with some opinionated options preset. It provides custom `.mustache` files that replace the default files included in the `@wordpress/create-block` script for WordPress block scaffolding.

Alley's Create Block script is a tool to scaffold WordPress blocks for projects that use [`@wordpress/scripts`](https://www.npmjs.com/package/@wordpress/scripts) for the build system. It generates PHP, JS, CSS code, and everything you need to start authoring a block in your WordPress project.

This script was written to pair with the [Create WordPress Plugin](https://github.com/alleyinteractive/create-wordpress-plugin) but can easily adopt to other projects which use `@wordpress/scripts`.

> _This script requires the use of `@wordpress/scripts` in your project._

### Use

Run the script to generate a block:

```sh
$ npx @alleyinteractive/create-block [options]
```
Without providing any options the tool will prompt the user through several options for creating a block.

### `CLI options`
```bash
  -n, --namespace <string>      The namespace for the block. (default: create-block)
  -b, --blocks-dir <string>     The directory where the blocks will be created
                                relative to the current working directory.
                                (default: blocks)
  -l, --block-language <string> The language for the block. Accepts `typescript`
                                or `javascript`. (default: typescript)
  -r, --skip-registration       Skip registering the block in PHP with register_block_type().
                                (default: false)
  -h, --help                    Display the help usage guide.
```

### Prompt options
The script will run and will start prompting for the input required to scaffold the block using `@wordpress/create-block` in [interactive mode](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#interactive-mode). See details about the available prompts in the [@wordpress/create-block documentation](https://developer.wordpress.org/block-editor/reference-guides/packages/packages-create-block/#options).

### Recommended Setup
* Install `@alleyinteractive/create-block` as a devDependency on a project.
* Add a `create-block` script command in the projects `package.json` file to call the script.
* Add project specific flags to the command setting `--blocksDir`, `--namespace`, and `--blockLanguage` accordingly.

Example in `package.json`:
```json
"scripts": {
    "create-block": "alley-create-block -n my-projects-namespace -l typescript",
}
```
The example above will scaffold blocks in the default "blocks" directory in a project using the namespace of "my-projects-namespace" and using typescript as the block language.

### From Source

To work on this repository:

```sh
git clone git@github.com:alleyinteractive/alley-scripts.git
cd packages/create-block
npm ci
```

In order to test the config with another project, you will need to point to this package, e.g.:

```json
{
  "devDependences": {
    "@alleyinteractive/create-block": "file:../path/to/alley-scripts/packages/create-block"
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

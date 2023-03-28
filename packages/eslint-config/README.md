# Alley's ESLint Configuration

[![standard README badge](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

Alley's standard ESLint configuration, which includes support for React, React Hooks, and TypeScript.

## Background

This package leverages [Airbnb's ESLint config](https://www.npmjs.com/package/eslint-config-airbnb) and [Airbnb Typescript](https://www.npmjs.com/package/eslint-config-airbnb-typescript) along with Babel and Typescript ESLint parsers making it easy to configure JavaScript linting for projects that might also include React and TypeScript.

## Releases

This package adheres to semantic versioning and is released on https://www.npmjs.com/.

### Use

First, install the package from npm:

```sh
npm install --save-dev @alleyinteractive/eslint-config
```
Next, choose a configuration from the available ESLint configurations.

This package exports four ESLint configurations for usage.
1. `@alleyinteractive/eslint-config` - Default configuration that supports React.
2. `@alleyinteractive/eslint-config/base` - Base configuration similar to Airbnb's base configuration 
without supporting React plugins.
3. `@alleyinteractive/eslint-config/typescript` - Typescript support without React plugin support.
4. `@alleyinteractive/eslint-config/typescript-react` - Typescript and React support.

Each configuration has required dependencies. You will need to install the peer dependencies using this shortcut:

```sh
npx install-peerdeps --dev @alleyinteractive/eslint-config
```

Then create an `.eslintrc.json` file in your project that extends the configuration:

```json
{
	"extends": ["@alleyinteractive/eslint-config"]
}
```

Finally, add `lint` commands to your `package.json`:

```json
{
	"scripts": {
		"lint": "eslint --ext .ts,.tsx,.js,.jsx .",
		"lint:fix": "eslint --ext .ts,.tsx,.js,.jsx --fix ."
	}
}
```

### From Source

To work on this repository:

```sh
git clone git@github.com:alleyinteractive/alley-scripts.git
cd packages/eslint-config
npm ci
```

In order to test the config with another project, you will need to point to this package, e.g.:

```json
{
	"devDependences": {
		"@alleyinteractive/eslint-config": "file:../path/to/alley-scripts/packages/eslint-config"
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
ESLint configuration is found in `index.js`.


## Third-Party Dependencies

Third party dependencies are managed by `npm` and are visible in `package.json`. This package intends to reduce the
dependency load on projects that use it by managing the dependencies itself.


## Related Efforts

- [ESLint](https://eslint.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Airbnb's ESLint Standards](https://github.com/airbnb/javascript)
- [typescript-eslint](https://typescript-eslint.io/)


## Maintainers

- [Alley](https://github.com/alleyinteractive)

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)


### Contributors

Thanks to all of the [contributors](../../CONTRIBUTORS.md) to this project.


## License

This project is licensed under the
[GNU Public License (GPL) version 2](LICENSE) or later.

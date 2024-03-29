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
2. `@alleyinteractive/eslint-config/base` - Base configuration similar to Airbnb's base configuration without supporting React plugins.
3. `@alleyinteractive/eslint-config/typescript` - Typescript support without React plugin support.
4. `@alleyinteractive/eslint-config/typescript-react` - Typescript and React support.

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

If you are resolving your modules with the ESLint webpack import resolver, you will need to add the `eslint-import-resolver-webpack` package and settings configuration in your project:
```
npm install --save-dev eslint-import-resolver-webpack
```

You will also need to add the following to the
projects `.eslintrc.json` file:

```json
  "settings": {
    "import/resolver": "webpack"
  },
```

### TypeScript and Monorepo configuration

#### TypeScript
For TypeScript projects, you will need to explicitly include files you would like to lint in your `tsconfig.json` file. One way of doing this is to extend the base `tsconfig.json`` file and provide specific configurations for ESLint.

1. Create a `tsconfig.eslint.json` file in your project that extends the base `tsconfig.json` file.
2. Add the `allowImportingTsExtensions` and `noEmit` compiler options to the `compilerOptions` object since this configuration is not for compiling TypeScript.
3. Add the files you would like to lint to the `include` array.

Example of a `tsconfig.eslint.json` file:
```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "allowImportingTsExtensions": true,
    "noEmit": true,
  },
  "include": [
    "../jest.config.js",
    "../config/webpack.config.ts",
    "../utils",
    "../index.ts",
    "../.eslintrc.js",
    "../utils/index.test.ts",
    "../utils/webpack.test.ts"
  ]
}
```

#### Monorepo
If you're using a monorepo, there may be additional steps to setup typed linting.

This package uses the `typescript-eslint` parser and plugin to support TypeScript.

ESLint requires a `tsconfig.json` file to be present in the root of the project and `typescript-eslint` needs to find the `tsconfig.json` file that is used for linting.

If you have a specific tsconfig file for ESLint such as a `tsconfig.eslint.json` file you will need to specify the path to this file in the `parserOptions.project` setting in your `.eslintrc.json` file.

```json
  "parserOptions": {
    "project": "./tsconfig.eslint.json"
  }
```
More details: https://typescript-eslint.io/linting/typed-linting/monorepos

In some cases where there is no tsconfig file in your project root you may need to convert your eslintrc file to JavaScript to pass in the node global of `__dirname` to the `parserOptions.tsconfigRootDir` setting.

```diff
// eslintrc.js
module.exports = {
  extends: ['@alleyinteractive/eslint-config/typescript'],
+  parserOptions: {
+    project: `./tsconfig.eslint.json`,
+    tsconfigRootDir: __dirname,
+  },
};
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

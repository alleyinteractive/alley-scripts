# Alley Typescript Configuration

A preset of a [Typescript](https://www.typescriptlang.org/) configuration that you can use in your project's `tsconfig.json` file.

## Installation

```bash
$ npm install @alleyinteractive/tsconfig --save-dev
```

## Usage

If you've installed `@alleyinteractive/tsconfig` locally within your project, extend it from your project's `tsconfig.json` file:

```json
{
  "extends": "@alleyinteractive/tsconfig/base.json"
}
```

The configuration can be extended with any additional option, including
overriding the base configuration. Out of the box, the configuration includes
some common best practices for Typescript projects and projects in the monorepo,
including:

* `allowJs`: `true` - Allows JavaScript files to be included in the project by
  default.
* `declaration`: `true` - Generates `.d.ts` files for each `.ts` file.
* `declarationMap`: `true` - Generates `.d.ts.map` files for each `.d.ts` file.
* `esModuleInterop`: `true` - Allows interoperability between CommonJS and ES
  modules.
* `forceConsistentCasingInFileNames`: `true` - Ensures that all file names are
  consistent.
* `inlineSources`: `true` - Includes the source code in the source map.
* `isolatedModules`: `true` - Ensures that each file can be safely transpiled
  without relying on other imports.
* `jsx`: `react-jsx` - Emit `.js` files with the JSX changed to `_jsx` calls
* `module`: `esnext` - See [module](https://www.typescriptlang.org/tsconfig#module)
  for more information.
* `moduleResolution`: `node` - See
  [moduleResolution](https://www.typescriptlang.org/tsconfig#moduleResolution)
  for more information.
* `noImplicitAny`: `true` - Ensures that all variables have an explicit type.
* `noUnusedLocals`: `true` - Ensures that all variables are used.
* `noUnusedParameters`: `true` - Ensures that all parameters are used.
* `outDir`: `build` - The output directory for the transpiled files.
* `preserveWatchOutput`: `true` - Ensures that the output is cleared before
  each build.
* `skipLibCheck`: `true` - Skips type checking of `.d.ts` files.
* `sourceMap`: `true` - Generates source maps for the transpiled files.
* `strict`: `true` - Enables all strict type checking options.
* `target`: `esnext` - See [target](https://www.typescriptlang.org/tsconfig#target)
  for more information.

Read more about the [TSConfig.json file here](https://www.typescriptlang.org/tsconfig).

### Extending the Configuration

You can extend the configuration with any additional options. For example, if
you want to disallow JavaScript files in your project, you can add the following
to your `tsconfig.json` file:

```json
{
  "extends": "@alleyinteractive/tsconfig/base.json",
  "compilerOptions": {
	"allowJs": false
  }
}
```

## Changelog

0.1.0 – Initial release

## Development Process

This package is developed as part of the [Alley Scripts](https://github.com/alleyinteractive/alley-scripts) project on GitHub. The project is organized as a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) and individual packages are published to npm under the [@alleyinteractive](https://www.npmjs.com/org/alleyinteractive) organization.

### Contributing

You can contribute to this project in several ways:

* Visit the main [Alley Scripts GitHub repo](https://github.com/alleyinteractive/alley-scripts) to [Open an issue](https://github.com/alleyinteractive/alley-scripts/issues/new) or submit PRs.
* Alley employees can ask questions or ask for support in the [#ux_development](https://alleyinteractive.slack.com/archives/C58QWRBL2) channel in Slack.

### Releases

This project adheres to the [Semantic Versioning 2.0.0](https://semver.org/) specification. All major, minor, and patch releases are published to npm and tagged in the repo. We will maintain separate branches for each minor release (e.g. block-editor-tools/0.1) to manage patch releases while keeping future development in the `main` branch.

## Maintainers

This project is actively maintained by [Alley Interactive](https://github.com/alleyinteractive). Like what you see? [Come work with us](https://alley.com/careers/).

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)

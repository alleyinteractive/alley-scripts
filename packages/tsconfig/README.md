# Alley Typescript Configuration

A preset of a [Typescript](https://www.typescriptlang.org/) configuration that you can use in your project's `tsconfig.json` file.

## Installation

```bash
$ npm install @alleyinteractive/typescript --save-dev
```

## Usage

If you've installed `@alleyinteractive/typescript` locally within your project, extend it from your project's `tsconfig.json` file:

```json
{
  "extends": "@alleyinteractive/tsconfig/base.json",

  // ...
}
```

The configuration can be extended with any additional option, including overriding the base configuration.

## Dependencies

This configuration has peer dependencies of any version of Typescript.

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

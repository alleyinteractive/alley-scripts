# Alley Stylelint Configuration

A set of [stylelint](https://stylelint.io/) configuration rules that extends the [stylelint-config-sass-guidelines](https://github.com/bjankord/stylelint-config-sass-guidelines) intended for use with SCSS syntax.

This stylelint config:
* extends the [stylelint-config-sass-guidelines](https://github.com/bjankord/stylelint-config-sass-guidelines) linter. You can view the documented configured lints for the [stylelint-config-sass-guidelines in the projects readme](https://github.com/bjankord/stylelint-config-sass-guidelines/tree/main#documentation).
* has a peer dependency of [stylelint](https://github.com/stylelint/stylelint).
* has a peer dependency of [stylelint-config-sass-guidelines](https://github.com/bjankord/stylelint-config-sass-guidelines).

## Installation

```bash
$ npm install @alleyinteractive/stylelint-config --save-dev
```

## Usage

If you've installed `@alleyinteractive/stylelint-config` locally within your project, just set your `stylelint` config to:

```json
{
	"extends": "@alleyinteractive/stylelint-config"
}
```

### Extending the config

Simply add a `"rules"` key to your config and add your overrides there.

For example, to change the `block-no-empty` to false and turn off the `block-no-empty` rule:

```json
{
	"extends": "@alleyinteractive/stylelint-config",
	"rules": {
		"block-no-empty": false,
	}
}
```

## Dependencies

This configuration has peer dependencies of [stylelint](https://github.com/stylelint/stylelint) and [stylelint-config-sass-guidelines](https://github.com/bjankord/stylelint-config-sass-guidelines).

## Changelog

0.0.1 – Initial release

## Development Process

This package is developed as part of the [Alley Scripts](https://github.com/alleyinteractive/alley-scripts) project on GitHub. The project is organized as a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) and individual packages are published to npm under the [@alleyinteractive](https://www.npmjs.com/org/alleyinteractive) organization.

### Contributing

You can contribute to this project in several ways:

* Visit the main [Alley Scripts GitHub repo](https://github.com/alleyinteractive/alley-scripts) to [Open an issue](https://github.com/alleyinteractive/alley-scripts/issues/new) or submit PRs.
* Alley employees can ask questions or ask for support in the [#ux_development](https://alleyinteractive.slack.com/archives/C58QWRBL2) channel in Slack.

### Releases

This project adheres to the [Semantic Versioning 2.0.0](https://semver.org/) specification. All major, minor, and patch releases are published to npm and tagged in the repo. We will maintain separate branches for each minor release (e.g. block-editor-tools/0.1) to manage patch releases while keeping future development in the `main` branch.

We recommend using [np](https://www.npmjs.com/package/np) to handle publishing releases and generating git tags.

## Maintainers

This project is actively maintained by [Alley Interactive](https://github.com/alleyinteractive). Like what you see? [Come work with us](https://alley.co/careers/).

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)

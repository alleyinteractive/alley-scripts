# Alley Block Editor Tools

[![README standard](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

This package contains a set of modules used by [Alley Interactive](https://alley.co) to aid in building features for the WordPress block editor.

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Changelog](#changelog)
- [Development Process](#development-process)
    - [Contributing](#contributing)
	- [Releases](#Releases)
- [Maintainers](#maintainers)
- [License](#license)

## Install

Install this package in your project:

```sh
npm install @alleyinteractive/block-editor-tools --save
```

This package assumes your project is running in an environment compatible with the WordPress block editor and is using the [Dependency Extraction Webpack Plugin](https://www.npmjs.com/package/@wordpress/dependency-extraction-webpack-plugin) or similar to externalize dependencies included in WordPress. As such, this package does not include these dependencies.

## Usage

To use modules from this package, import them into your files using the `import` declaration

```js
import { usePostMeta } from '@alleyinteractive/block-editor-tools';

const MyComponent = () => {
	const [meta, setMeta] = usePostMeta();
	const { my_meta_key: myMetaKey } = meta;

	return (
		<TextControl
			label={__('My Meta Key', 'alley-scripts')}
			onChange={(newValue) => setMeta({ ...meta, my_meta_key: newValue })}
			value={myMetaKey}
		/>
	);
};
```

## Changelog

### 0.3.0

- Addition of `<PostPicker>` component.
- Addition of `usePostById` hook.

### 0.1.0

- Addition of Eslint configuration and rules.
- Make peer dependency requirements lenient.
- Add Styleint config.
- Include Typescript types.

### 0.0.1

– Initial release

## Development Process

This package is developed as part of the [Alley Scripts](https://github.com/alleyinteractive/alley-scripts) project on GitHub. The project is organized as a monorepo using [npm workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) and individual packages are published to npm under the [@alleyinteractive](https://www.npmjs.com/org/alleyinteractive) organization.

### Contributing

You can contribute to this project in several ways:

* Visit the main [Alley Scripts GitHub repo](https://github.com/alleyinteractive/alley-scripts) to [Open an issue](https://github.com/alleyinteractive/alley-scripts/issues/new) or submit PRs.
* Alley employees can ask questions or ask for support in the [#javascript](https://alleyinteractive.slack.com/archives/C035Y7Q3X) channel in Slack.

### Releases

This project adheres to the [Semantic Versioning 2.0.0](https://semver.org/) specification. All major, minor, and patch releases are published to npm and tagged in the repo. We will maintain separate branches for each minor release (e.g. block-editor-tools/0.1) to manage patch releases while keeping future development in the `main` branch.

## Maintainers

This project is actively maintained by [Alley Interactive](https://github.com/alleyinteractive). Like what you see? [Come work with us](https://alley.com/careers/).

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)

## License

This software is released under the terms of the GNU General Public License version 2 or any later version.

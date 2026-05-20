# Alley's Oxlint/Oxfmt Configuration(s)

Alley's shared [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) configuration for linting and formatting JavaScript, TypeScript, React, and JSX/TSX.

## Releases

This package adheres to semantic versioning and is released on https://www.npmjs.com/.

## Installation

```bash
npm install --save-dev @alleyinteractive/oxlint-config
```

## Usage

### Linting (Oxlint)

Create an `oxlintrc.config.ts` in your project root:

```ts
import { defineConfig } from 'oxlint';
import oxlintConfig from '@alleyinteractive/oxlint-config';

export default defineConfig({
  extends: [oxlintConfig],
  rules: {
    // Example of how to override a config rule.
    'import/extensions': 'off',
  },
});
```

Add a `lint` script to your `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint -c oxlintrc.config.ts ."
  }
}
```

### Formatting (Oxfmt)

Create an `oxfmt.config.ts` in your project root:

```ts
import { defineConfig } from 'oxfmt';
import oxfmtConfig from '@alleyinteractive/oxlint-config/oxfmt';

export default defineConfig({
  ...oxfmtConfig,
  // Example of how to extend the config.
  ignorePatterns: ['build', 'dist'],
});
```

Add a formatter script to your `package.json`:

```json
{
  "scripts": {
    "format": "oxfmt -c oxfmt.config.ts .",
    "format:check": "oxfmt -c oxfmt.config.ts . --check"
  }
}
```

## Maintainers

- [Alley](https://github.com/alleyinteractive)

![Alley logo](https://avatars.githubusercontent.com/u/1733454?s=200&v=4)

### Contributors

Thanks to all the [contributors](../../CONTRIBUTORS.md) to this project.

## License

This software is released under the terms of the GNU General Public License version 2 or any later version.

# @alleyinteractive/oxlint-config

Alley's shared [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) and [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) configuration for linting and formatting JavaScript, TypeScript, React, and JSX/TSX.

## Installation

```bash
npm install --save-dev @alleyinteractive/oxlint-config
```

## Usage

### Linting

Create an `.oxlintrc.json` in your project root:

```json
{
  "extends": ["./node_modules/@alleyinteractive/oxlint-config/oxlintrc.json"]
}
```

Add a lint script to your `package.json`:

```json
{
  "scripts": {
    "lint": "oxlint -c .oxlintrc.json ."
  }
}
```

### Formatting

Use the shared Oxfmt configuration:

```bash
oxfmt --config ./node_modules/@alleyinteractive/oxlint-config/oxfmt.json .
```

Or add a format script to your `package.json`:

```json
{
  "scripts": {
    "format": "oxfmt --config ./node_modules/@alleyinteractive/oxlint-config/oxfmt.json ."
  }
}
```

### Overriding Rules

Add rule overrides in your local `.oxlintrc.json`:

```json
{
  "extends": ["./node_modules/@alleyinteractive/oxlint-config/oxlintrc.json"],
  "rules": {
    "no-console": "off"
  }
}
```

## What's Included

### Linting (Oxlint)

Plugins enabled:

- `react` - React-specific rules
- `typescript` - TypeScript rules
- `import` - Import/export rules
- `jsx-a11y` - Accessibility rules for JSX
- `react-hooks` - Rules of Hooks enforcement
- `unicorn` - Various helpful rules

JS Plugins:

- `oxlint-plugin-eslint` - Bridges ESLint core rules (e.g., `no-restricted-syntax`)

### Formatting (Oxfmt)

- Single quotes
- Semicolons
- Trailing commas
- 2-space indentation
- 100 character print width
- LF line endings

## CSS Linting

Oxlint does not lint CSS/SCSS. For CSS linting, use [@alleyinteractive/stylelint-config](https://github.com/alleyinteractive/alley-scripts/tree/main/packages/stylelint-config) separately. Oxfmt can format CSS/SCSS files.

## Migrating from @alleyinteractive/eslint-config

1. Replace `@alleyinteractive/eslint-config` with `@alleyinteractive/oxlint-config` in your `devDependencies`
2. Delete `.eslintrc.json` / `.eslintrc.js`
3. Create `.oxlintrc.json` extending the shared config (see above)
4. Update your `lint` script from `eslint ...` to `oxlint -c .oxlintrc.json .`
5. Delete `tsconfig.eslint.json` if it only served ESLint's TypeScript parser

## License

GPL-2.0-or-later

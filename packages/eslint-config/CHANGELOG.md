# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 0.1.4 - 2023-11-20

- Update dependencies and consolidated shared devDependencies into the root `package.json` file.

## 0.1.3 - 2023-09-12

- Ensure that file extensions are not required for imports with the extensions specified in the `import/extensions` rule. `.js, .mjs, .ts, .jsx, .tsx`.
- Reorganize internal rules for readability using spread operators over extending rules with require.resolve.
- Update dependencies and address npm audit warnings.

## 0.1.2 - 2023-08-16

- Add `allowExpressions` to `react/jsx-no-useless-fragment` rule to allow for `<>{children}</>` syntax, which is
  necessary for satisfying the TypeScript compiler when the exact shape of `children` is unknown.

## 0.1.1 - 2023-08-05

- Bump `@typescript-eslint/parser` from 6.2.0 to 6.2.1.

## 0.1.0 - 2023-03-29

- Reorder ESLint extends in `/typescript-react` to ensure proper rules are followed.

## 0.0.2 - 2023-03-28

- Add support for JSX in `.tsx` files.
- Fix for including files for multiple configurations.

## [0.0.1] - 2023-01-10

- Initial version. Basic support for common use cases at Alley.

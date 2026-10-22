# CLAUDE.md

Guidance for working in `@alleyinteractive/block-editor-tools`. See the repo-root `CLAUDE.md` for monorepo-wide commands, versioning, and release process.

## What this package is

React components, hooks, and services for building WordPress block editor (Gutenberg) features. Consumers import everything from the package root (`import { usePostMeta } from '@alleyinteractive/block-editor-tools'`) or individual modules via the `./*` export (`build/<path>/index.js`).

## Commands

Run from this directory:

```sh
npm run build         # webpack production build + tsc declaration emit into build/
npm run dev           # webpack watch (development, unminified filenames)
npm run check-types   # tsc --noEmit -p tsconfig.eslint.json (src, tests, stories, configs)
npm run lint          # eslint over .ts/.tsx
npm run lint:fix
npm test              # jest --passWithNoTests
npx jest src/services/media/get-media-url.test.ts   # single file
```

Storybook runs from the repo root (`npm run storybook`, port 6006); root `.storybook/main.ts` picks up `src/**/*.stories.*` from this package.

## Layout and export conventions

```
src/
  index.ts               # re-exports ./components, ./hooks, ./services, and shared types
  types.ts               # shared public types + internal data-store selector interfaces
  components/<kebab-name>/index.tsx   (+ README.md, index.stories.tsx, index.test.tsx)
  hooks/use-<name>/index.ts           (+ README.md, index.test.ts)
  services/<group>/<name>.ts          (+ <name>.test.ts)
```

- Every module is a **default export** in its own directory, re-exported by name from the barrel (`src/components/index.ts`, `src/hooks/index.ts`, `src/services/index.ts`). Adding a module means adding a line to the relevant barrel — otherwise it won't be in the main bundle or the root types. Public types (props interfaces, setter types, etc.) are exported with `export type { … }` from the same barrels; add new ones there too.
- Webpack (`webpack.config.ts`) also creates a **separate entry for every directory under `src/` that has an `index.{ts,tsx}`**, output to `build/<relative-path>/index.js` (the root entry is `build/index.bundle.min.js`). Nested directories with an index file become entries too, so put shared types in a plain file (e.g. `src/types.ts`, `selector/types.ts`), not a `types/index.ts` directory. Entry names are the bare directory name, so two directories with the same name will collide.
- Output is UMD. `@wordpress/*` packages (and React) are externalized by `DependencyExtractionWebpackPlugin` and resolved from the `wp` global at runtime — this is why they're `devDependencies` and why `import/no-extraneous-dependencies` is disabled in `.eslintrc.js`. Non-WP libraries (e.g. `dompurify`, `papaparse`, `uuid`, `styled-components`, `classnames`) are bundled in.
- Styles: `.scss` imported directly from components (style-loader → injected at runtime). `styled-components` is also used.
- **100% TypeScript** — webpack, ESLint, and Jest only handle `.ts`/`.tsx`. Don't add `.js`/`.jsx` source files. Use TS props interfaces (no `prop-types`) and default parameter values (no `defaultProps` on function components).
- When converting `defaultProps` to default parameters, hoist array/object defaults to module-level constants if they feed hook dependencies — a new `[]` each render can cause effect loops (see `Selector`).
- `*.stories.tsx` and `*.test.ts(x)` files are excluded from `tsconfig.json` (not emitted to `build/`), but are type-checked/linted via `tsconfig.eslint.json`.
- `webpack.config.ts` and `jest.config.ts` are loaded via ts-node (`"ts-node"` block in `tsconfig.json` forces CommonJS). `.eslintrc.js` stays JS because legacy ESLint config can't be TS.
- Typing `@wordpress/data` selectors: `select('core')`/`select('core/editor')` with string names type as `never`, and `@wordpress/block-editor` ships no types (`@types/wordpress__block-editor` v7 is stale). Keep the string store names (so `assets.json` script dependencies don't change) and cast to the local selector interfaces in `src/types.ts` (`CoreSelectors`, `EditorSelectors`, `BlockEditorSelectors`), adding selectors there as needed.
- Some deprecated `Button` props (`isTertiary`, `isSecondary`, `isSmall`) are intentionally kept via a typed spread for older WordPress runtimes; don't "fix" them to `variant`/`size` without considering WP version support.
- `@/*` path alias maps to the package root (tsconfig + jest `moduleNameMapper`).

## Code style

- ESLint: `@alleyinteractive/eslint-config/typescript-react` (Airbnb-based; 2-space indent, single quotes, trailing commas). Default props via `react/require-default-props` and the function-component-definition rule are both turned off.
- Hooks typically wrap `@wordpress/data` (`useSelect`, `useRegistry`) and `@wordpress/core-data` (`useEntityProp`, `useEntityRecord(s)`), default to the current post when IDs aren't passed, and guard against `undefined` returns from the data stores (see `use-post-meta`).
- Document functions/hooks with JSDoc blocks including `@param`/`@returns`.
- Use `__()` from `@wordpress/i18n` for user-facing strings.

## Tests

Jest with `ts-jest`; default `testEnvironment: 'node'`. Coverage is thin. Patterns in use:
- Hooks that only call `useSelect`: mock `@wordpress/data` with `useSelect: (mapSelect) => mapSelect(select)` (see `use-preview-link/index.test.ts`). Importing from the hooks barrel (`'..'`) loads every WP store and breaks under mocks — mock `'..'` with `jest.requireActual` of the specific sibling hooks instead (see `use-inner-block-index/index.test.ts`).
- Components: add a `/** @jest-environment jsdom */` docblock and render with `react-dom/client` + `act` (no React Testing Library installed); set `globalThis.IS_REACT_ACT_ENVIRONMENT = true` (see `csv-uploader/index.test.tsx`).

## Documentation

Each module's `README.md` documents its props/usage, and the package `README.md` has a section per component/hook/service. When adding or changing a module's public API, update both. The package README is missing entries for some exported modules (e.g. `PostSelector`, `Sortable`, `SortableItem`, `useCurrentTheme`, `useInnerBlocks`, `useOption`, `usePreviewLink`, `useTerm`).

## Manual testing in WordPress

`plugin/entries/slotfills/index.tsx` imports directly from `../../../packages/block-editor-tools/src`, so building/watching `plugin/` (`cd ../../plugin && npm run start`) exercises local source changes in a real editor without rebuilding this package. Add a demo there when building something new.

## Releasing

Any change to published behavior needs a changeset from the repo root (`npm run changeset`, select `@alleyinteractive/block-editor-tools`). Don't edit `version` or `CHANGELOG.md` by hand.

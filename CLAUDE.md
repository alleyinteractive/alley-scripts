# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Monorepo of npm packages published under `@alleyinteractive/*` (WordPress/JS tooling), managed with Turborepo + npm workspaces. Workspaces are `packages/*` and `plugin/` (a private WordPress demo plugin used to exercise the packages). Node `>=22 <26` is enforced via `check-node-version` pre-scripts (see `.nvmrc`).

## Commands

Root (runs across all workspaces via turbo):

```sh
npm install
npm run build          # turbo build (respects ^build dependency order)
npm run lint
npm run format:check   # only oxlint-config defines format scripts currently
npm run test
npm run storybook      # Storybook for block-editor-tools components (port 6006)
npm run changeset      # create a changeset for a package change
```

CI (`.github/workflows/all-pr-tests.yml`) runs `lint`, `format:check`, `test`, `build` on Node 22/24/25, plus `composer test` (phpcs) in `plugin/`.

Scope to one package: `npx turbo run test --filter=@alleyinteractive/scaffolder`, or `cd packages/<pkg> && npm test`.

Run a single test file:
- Most packages (ts-jest): `cd packages/<pkg> && npx jest path/to/file.test.ts` (add `-t "name"` for a single case).
- `scaffolder` requires ESM VM modules — use its script: `cd packages/scaffolder && npm test -- src/features/extensions.spec.ts`.

## Packages and how they relate

- **build-tool** (`alley-build` bin): wrapper around `wp-scripts` that injects its own webpack config (`config/webpack.config.ts`) for `build`/`start`. Convention: blocks in `blocks/`, slotfills/other entry points in `entries/`, each compiled to its own output dir. Built to both CJS and ESM (`dist/cjs`, `dist/esm`). `plugin/` builds by invoking `../packages/build-tool/dist/cjs/index.js` directly, so build-tool must be built first.
- **block-editor-tools**: React components/hooks/services for the Gutenberg editor (`src/components`, `src/hooks`, `src/services`, re-exported from `src/index.js`). Each component dir typically has `index.jsx|tsx`, `README.md`, and an `index.stories.tsx` picked up by root `.storybook`. Webpack build + emitted `.d.ts` types.
- **scaffolder** (`scaffolder` bin): template-driven project scaffolder. Reads `.scaffolder/` config from the project root (searching parent dirs) and a global config dir. Features are YAML `config.yml` files (or JavaScript feature packages / JS hooks for YAML features — see `src/features/extensions.ts`). Feature sources can be directories, GitHub, or git remotes (`src/features/sources.ts`, `remoteSources.ts` clone to local dirs). `src/generators/` holds the per-type generators (file, composer, repository, javascript). Templates use the expression engine in `src/expressions/` (e.g. `{{ dasherize inputs.x }}`). Built with Babel + `tsc` for types. Detailed docs in `packages/scaffolder/docs/`.
- **scaffolder-features**: no code — a collection of published scaffolder feature configs (`scaffolder/<feature>/config.yml`).
- **create-block** / **create-entry** / **create-release**: small CLIs (`tsc`-built) that generate blocks, entry points/slotfills, and releases. `create-block` ships `templates/javascript` and `templates/typescript`.
- **eslint-config**, **oxlint-config**, **stylelint-config**, **tsconfig**: shared lint/format/TS configs. Root `.eslintrc.json` is used by most packages.

## Versioning and releases

- Do not bump `package.json` versions manually. Add a changeset (`npm run changeset`) in the feature branch; on merge to `main` the Changesets action opens a "Version Packages" PR, and merging that publishes via npm Trusted Publishers (OIDC, `release.yml`).
- Snapshot pre-releases: see `docs/snapshot-releases.md`.
- New packages: `npx turbo gen workspace --type package` (scaffolds with `"private": true`; remove when ready to publish). See `docs/adding-packages.md`.

PRs target `main`.

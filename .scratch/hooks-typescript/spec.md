# Convert block-editor-tools hooks to TypeScript

Status: ready-for-agent
Parent: alleyinteractive/alley-scripts#106 (do not edit the parent issue)

## Problem Statement

Developers consuming `@alleyinteractive/block-editor-tools` from a TypeScript project get poor or misleading types for almost every hook. Only one hook (`useOption`) is authored in TypeScript; the remaining 21 are JavaScript whose published declarations are inferred from JSDoc that is frequently wrong (e.g. `{int}` types, and claims that `usePost` / `useTerm` return a `hasResolved` property they never return). The result is that consumers — including this package's own components — fall back to `as any as …` casts and `@ts-ignore` to use the hooks, losing type safety exactly where WordPress data is shaped and nullable in non-obvious ways.

## Solution

Every hook in the package is authored in TypeScript with an accurate public signature, without changing any runtime behaviour or call signature. Entity hooks return `wp-types` REST shapes behind a generic the consumer can narrow or widen (custom post types, registered meta, `_fields` queries), and their nullability reflects what `@wordpress/core-data` actually returns. Block-tree hooks and Editor-context hooks return precise primitive or block types. Documentation (JSDoc and per-hook READMEs) is corrected to describe the real behaviour, and hooks gaining a generic show a short TypeScript example. A consumer can upgrade the package and immediately delete casts without any runtime risk.

## User Stories

1. As a TypeScript consumer, I want `usePost` to return a typed post record, so that I can access `title.rendered` without casting.
2. As a TypeScript consumer, I want to pass my own post shape to `usePost`, so that custom fields registered on my post type are typed.
3. As a TypeScript consumer, I want `usePost`'s return type to include `undefined`, so that the compiler forces me to handle the not-yet-loaded state.
4. As a TypeScript consumer, I want `usePosts` to return `T[] | null`, so that I handle the "entity not available" case the store actually produces.
5. As a TypeScript consumer, I want `usePostById` typed to include both `null` (still resolving the post type or post) and `undefined`, so that my loading UI is correct.
6. As a TypeScript consumer, I want `useTerm` to return a typed term record, so that I can read `name` and `slug` safely.
7. As a TypeScript consumer, I want `useTerms` typed as the tuple it actually returns (assigned term IDs and a setter), so that I don't mistake it for a list of term records.
8. As a TypeScript consumer, I want `useMedia` to return a typed attachment, so that I can read `source_url` and `media_details` without casting.
9. As a TypeScript consumer, I want `usePostMeta` to accept a meta shape generic, so that reads and writes of my registered meta keys are checked.
10. As a TypeScript consumer, I want `usePostMeta`'s default meta type to be `Record<string, unknown>` rather than `any`, so that I must narrow before using an untyped value.
11. As a TypeScript consumer, I want `usePostMeta`'s setter typed to accept either a full object or an updater function, so that the README's recommended function form type-checks.
12. As a TypeScript consumer, I want `usePostMetaValue` to accept a value-type generic, so that a single meta value is typed end to end.
13. As a TypeScript consumer, I want `usePostMetaValue`'s setter to accept either a value or an updater function, matching its runtime behaviour.
14. As a TypeScript consumer, I want `useOption` to keep inferring built-in WordPress setting types from the key, so that existing typed usage does not regress.
15. As a TypeScript consumer, I want `useInnerBlocks` to return typed block instances, so that I can read `clientId`, `name` and `attributes`.
16. As a TypeScript consumer, I want `useInnerBlocksAttributes`, `useInnerBlocksCount`, `useHasInnerBlocks` and `useInnerBlockIndex` to return precise types (attribute records, number, boolean, number), so that derived values need no casts.
17. As a TypeScript consumer, I want `useParentBlock`, `useParentBlockAttributes` and `useParentClientId` to include `null` in their return types, so that the root-level case is handled.
18. As a TypeScript consumer, I want `useBlockName` to return the block name type the block-editor store provides, so that comparisons against block names type-check.
19. As a TypeScript consumer, I want `useCurrentPostId`, `useCurrentTheme` and `usePreviewLink` to return precise primitive types including their null cases, so that editor-context checks are honest.
20. As a TypeScript consumer, I want `useDebounce` typed generically over its value and still marked `@deprecated`, so that my editor flags usages while existing code keeps compiling.
21. As a TypeScript consumer, I want to import the named types that appear in hook return values (e.g. the `useOption` return type, the post meta setter type, the `usePostMeta` tuple type) from the package root, so that I can annotate my own props and helpers.
22. As a TypeScript consumer, I want the published declarations to resolve `wp-types` without installing it myself, so that types don't silently degrade to `any`.
23. As a JavaScript consumer, I want runtime behaviour and call signatures unchanged, so that upgrading carries no risk.
24. As a JavaScript consumer, I want the JSDoc and READMEs to stop promising a `hasResolved` property, so that I don't write code against behaviour that doesn't exist.
25. As a maintainer, I want any unavoidable `any` or `@ts-ignore` confined to the data-store boundary with a one-line reason, so that weak spots are visible and searchable.
26. As a maintainer, I want hooks that compose other hooks to import them directly rather than through the hooks barrel, so that circular imports don't degrade type inference.
27. As a maintainer, I want a before/after diff of the emitted hook declarations, so that reviewers can confirm every public type change is intended.
28. As a maintainer, I want commits grouped by Entity hooks, Block-tree hooks, Editor-context hooks and the remainder, so that the PR is reviewable in slices.
29. As a maintainer, I want API problems discovered during conversion recorded locally rather than fixed, so that this change stays non-breaking and follow-ups can be triaged deliberately.
30. As a reviewer, I want the type contract for Entity hooks recorded in an ADR, so that the deliberate `undefined`-vs-`null` split isn't "fixed" by someone later.

## Implementation Decisions

- **Type-only conversion.** All 21 JavaScript hooks and the hooks barrel become TypeScript. No runtime logic, default parameter, argument order or return shape changes. API problems found are logged, not fixed.
- **Store boundary.** Calls into `select(...)` / `useDispatch(...)` may use `any` or `@ts-ignore` where the installed `@wordpress/*` types are inadequate, each with a one-line reason comment. Where the store's own types work (e.g. the block-editor `store` import already used by Block-tree hooks), use them. Upgrading `@wordpress/*` packages is out of scope.
- **Entity hook contract** (per package ADR 0001):
  - Single-record hooks (`usePost`, `useTerm`, `useMedia`) take a generic bounded by and defaulting to the matching `wp-types` shape (`WP_REST_API_Post`, `WP_REST_API_Term`, `WP_REST_API_Attachment`) and return `T | undefined`, mirroring `getEntityRecord`.
  - `usePosts` takes the same post generic and returns `T[] | null`, mirroring `getEntityRecords`.
  - `usePostById` takes the post generic and returns `T | null | undefined`: it returns `null` while resolving the post type or before the record arrives, otherwise whatever `usePost` returns. **This corrects grilling Q8, which assumed it matched `usePost`.**
  - `useTerms` is not a record-list hook: it wraps `useEntityProp` and returns a tuple of the post's assigned term IDs (possibly `undefined`) and a setter accepting term IDs. It gets no record generic. **This corrects grilling Q8, which assumed `T[] | null`.**
  - `_fields` queries returning partial records are handled by the consumer passing a narrower `T`.
- **Post meta.** `usePostMeta` takes `TMeta extends Record<string, unknown>` defaulting to `Record<string, unknown>` and returns a tuple of `TMeta` and a setter accepting `TMeta` or `(prev: TMeta) => TMeta`. `usePostMetaValue` takes `TValue` defaulting to `unknown` and returns a tuple of `TValue` and a setter accepting `TValue` or `(prev: TValue) => TValue` (it already supports the function form at runtime; grilling Q9's value-only setter is widened to match). Both keep the nullable positional `postType` / `postId` parameters.
- **`useOption`** keeps its existing overloads and behaviour; only its return type is exported.
- **Block-tree hooks** use the block instance and attribute types from the WordPress blocks typings. Hooks returning `null` at the root level include it in their return type. `useInnerBlockIndex` returns a number (`-1` when not found).
- **Editor-context hooks** return precise primitives with their real null cases: current post ID (number or null), current theme stylesheet (string, null or undefined), block name (string or null), preview link (string or undefined, as currently declared by the selector it calls).
- **`useDebounce`** is converted generically over its value and keeps `@deprecated` and its console warning.
- **Exported types.** The package root exports only the types that appear in a hook's return value and that a consumer would plausibly need to name: the `useOption` return type, the post meta setter type and the `usePostMeta` tuple type. Store-boundary helper types stay internal.
- **Dependencies.** `wp-types` moves from devDependencies to dependencies because the emitted declarations import from it. If the WordPress blocks typings are referenced by emitted declarations, they are treated the same way.
- **Barrel imports.** Hooks composing other hooks import them directly instead of through the hooks barrel.
- **Docs.** JSDoc is corrected (types, return descriptions, removing `hasResolved` claims). Per-hook READMEs keep their JSX examples, are corrected where they repeat false claims, and hooks gaining a generic (Entity hooks, `usePostMeta`, `usePostMetaValue`, `useOption`) get a short TypeScript example.
- **Delivery.** One PR on the TypeScript conversion branch, commits grouped Entity / Block-tree / Editor-context / remainder.

## Testing Decisions

- **Seam: the package's public entry point and its emitted declarations.** Runtime behaviour is unchanged by design, so the only externally observable change is the published type surface. Verification happens there, not against hook internals.
- A good check exercises the public types as a consumer would see them — what `usePost<MyPost>()` resolves to, what the `usePostMeta` setter accepts — never the internal store-boundary types.
- Done means: type checking, lint and build pass in the package; the before/after diff of the emitted hook declarations shows only intended changes; and no `any` / `@ts-ignore` appears outside a store boundary without a reason comment.
- No new runtime tests are added. Setting up ts-jest (and any type-level assertion tooling) is a separate step of #106.
- Prior art: the only existing test in the package is a plain Jest unit test for a media service; there are no hook tests and no type-level tests.

## Out of Scope

- Any runtime or signature change, including normalising `undefined`/`null`, replacing positional nullable parameters, or adding `hasResolved`.
- Fixing runtime bugs discovered during conversion (logged locally instead).
- Removing the deprecated `useDebounce`.
- Upgrading `@wordpress/*` dependencies.
- Converting components, services, or other packages; removing the `post-picker` cast on `usePostById`.
- New runtime tests, ts-jest setup, or type-level assertion tooling.
- The top-level README "100% TypeScript" statement (end of #106).
- Editing GitHub issue #106.

## Further Notes

- Vocabulary follows the package glossary: Entity hook, Block-tree hook, Editor-context hook.
- **ADR 0001 needs a small amendment.** It states single-record hooks return `T | undefined`; `usePostById` is a single-record hook that also returns `null`. The amendment should name `usePostById` as the exception rather than change the contract.
- API problems and runtime bugs found so far are recorded in the package's local follow-ups file (not committed). Notably, reading the code during spec-writing surfaced two likely runtime bugs that this type-only conversion must preserve rather than fix: `usePreviewLink` calls a selector that lives on the editor store, not the core store; and `useInnerBlockIndex` passes a parent block object where a client ID is expected. Typing these honestly may require a store-boundary escape hatch.

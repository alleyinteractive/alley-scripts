---
"@alleyinteractive/block-editor-tools": minor
---

Convert hooks to TypeScript. Hook declarations now export real types, which may surface new type errors in TypeScript projects. Add optional peer dependencies on `wp-types`, `@types/wordpress__blocks` and `@wordpress/core-data` for those types.

Fix `usePreviewLink` throwing because it read from the `core` store instead of `core/editor`.

Fix `useInnerBlockIndex` returning -1 for nested blocks.

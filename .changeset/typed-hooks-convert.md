---
"@alleyinteractive/block-editor-tools": minor
---

Convert all hooks to TypeScript and export their types. Runtime behavior is unchanged, but TypeScript consumers may see stricter types on hook arguments and return values. `wp-types` and `@types/wordpress__blocks` are now regular dependencies so the generated type definitions resolve for consumers.

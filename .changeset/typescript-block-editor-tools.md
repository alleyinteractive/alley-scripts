---
"@alleyinteractive/block-editor-tools": minor
---

Convert all source code to TypeScript and export types for component props, hook return values, and shared WordPress data structures (`MediaObject`, `SelectedMedia`, `Block`, `PostMeta`, etc.). Runtime prop-types validation has been removed in favor of TypeScript types.

Also fixes bugs surfaced by the conversion:
- `usePreviewLink` now reads from the `core/editor` store (it previously threw a TypeError).
- `useInnerBlockIndex` now returns the correct index for nested blocks (it previously returned -1).
- `Selector` now sets `aria-labelledby` on its search results listbox.
- `CSVUploader` now displays the error message when parsing fails instead of crashing, and its form submit handler is correctly bound.

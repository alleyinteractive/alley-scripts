---
"@alleyinteractive/block-editor-tools": patch
---

Fix `usePreviewLink` to read the preview link from the `core/editor` store; it previously called a selector that does not exist on the `core` store and threw.

Fix `useInnerBlocksIndex` always returning `-1`; it passed the parent block object instead of its client ID when looking up siblings.

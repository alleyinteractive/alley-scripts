---
"@alleyinteractive/block-editor-tools": minor
---

Convert block-editor-tools to 100% TypeScript and ship types for every hook and component.

- Fix `useInnerBlockIndex` always returning -1, `usePreviewLink` reading from the wrong store, the missing `aria-labelledby` on `Selector` results, the `CSVUploader` submit handler, and `CSVUploader` crashing on a parse error.
- Replace `prop-types` with TypeScript interfaces and drop the dependency.
- Remove Babel and JavaScript support from the build, lint and test tooling.

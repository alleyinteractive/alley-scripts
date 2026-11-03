---
"@alleyinteractive/build-tool": minor
---

Support the block metadata `viewScriptModule`/`viewModule` field by handling the dual-compiler (array) webpack configuration that `wp-scripts` produces under `--experimental-modules`. Builds without the flag are unchanged. Under that flag, both compilers version the built blocks and refresh the blocks manifest, so versions stay correct when only a view module changes, and `alley-build build` cleans `build/` once before compiling.

---
"@alleyinteractive/build-tool": minor
---

Add support for the block metadata `viewScriptModule` (and `viewModule`) field when building with `--experimental-modules`, so blocks using the Interactivity API compile their view modules as ES modules.

With the flag (or `WP_EXPERIMENTAL_MODULES` set), the build tool configures both the script and module compilers that `wp-scripts` runs:

- Each block's view module is emitted alongside its other assets (e.g. `build/<block>/view.js`).
- Both compilers version the built blocks and refresh the blocks manifest, so versions stay correct when only a view module changes.
- `alley-build build` and `alley-build start` clean the build directory once before compiling, since neither compiler can clean it without deleting the other's output.

Overrides in a project `webpack.config.js` and entries in the `entries/` directory apply to the script compiler only, and Fast Refresh (`--hot`) is not supported for module entries. Builds without `--experimental-modules` are unchanged.

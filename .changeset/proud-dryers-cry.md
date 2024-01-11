---
"@alleyinteractive/create-release": patch
---

- Ensure that the version can be changed under a variety of different of different formats.
- Changes the default setting of the `--composer` and `--npm` flags to modify
  the plugin's `composer.json`/`package.json` files if the current version of
  the plugin is already set in the respective file.

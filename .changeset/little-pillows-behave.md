---
"@alleyinteractive/create-block": patch
---

Fixes an issue where the create-block command was failing due to an `unknown option '--textdomain'` error, caused by the option not being available in versions of `@wordpress/create-block` prior to `4.66.0`. Tightens the `@wordpress/create-block` version constraint from `*` to `^4.66.0` in both `dependencies` and `peerDependencies`.

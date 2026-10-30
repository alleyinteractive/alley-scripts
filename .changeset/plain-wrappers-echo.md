---
"@alleyinteractive/create-block": patch
---

Drop the redundant `wp_kses_data()` around `get_block_wrapper_attributes()` in the dynamic block `render.php` templates, since it already escapes its output. A `phpcs:ignore` comment is added so the scaffolded output passes PHPCS on rulesets that don't recognize it as an escaping function.

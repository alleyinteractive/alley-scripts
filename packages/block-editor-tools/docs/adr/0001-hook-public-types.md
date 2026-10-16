# Hook return types use `wp-types` shapes with consumer-supplied generics

Entity hooks return `wp-types` REST shapes (`WP_REST_API_Post`, `WP_REST_API_Term`, `WP_REST_API_Attachment`) behind a generic parameter that defaults to the base shape, so consumers can widen it for custom post types, meta, or `_fields` queries. Nullability mirrors what `@wordpress/core-data` actually returns rather than a tidied-up contract: single-record hooks return `T | undefined` (`getEntityRecord` never returns `null`), and list hooks return `T[] | null` (`getEntityRecords`). The one exception is `usePostById`, a single-record hook that returns `T | null | undefined`: it returns `null` while it looks up the post type or waits for the record, and otherwise whatever `usePost` returns. `useTerms` is not a record-list hook (it returns a post's assigned term IDs and a setter), so it takes no record generic. Because the published `.d.ts` files import from `wp-types`, it is a runtime `dependency` rather than a `devDependency` or `peerDependency`.

## Considered Options

- **Hand-written local types**: rejected; they would duplicate `wp-types` and drift from the REST API.
- **`wp-types` as a peer dependency**: rejected; it pushes an install onto every consumer for a types-only package with no runtime cost.
- **Normalising `undefined`/`null` to one sentinel**: rejected for the TypeScript conversion because it changes runtime behaviour; a candidate for a future major version.

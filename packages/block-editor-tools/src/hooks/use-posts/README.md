# Custom Hooks: usePosts

A custom React hook to retrieve multiple posts' data given an array of post IDs and a single post type.

## Usage

```jsx
const MyBlock = ({
 postIDs,
}) => {
  const posts = usePosts(postIDs, postType);

  if (posts) {
    ...
  }
};
```

The hook returns `null` until the posts are available.

## TypeScript Support

`usePosts` returns an array of `WP_REST_API_Post` from `wp-types` by default.
Pass your own post shape to type custom fields or registered meta.

```ts
const events = usePosts<Event>(postIDs, 'event');
// --> Event[] | null
```

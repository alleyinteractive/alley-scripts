# Custom Hooks: usePostById

A custom React hook to retrieve post data given only a post ID.
If you have the post type, use `usePost` instead.

## Usage

```jsx
const MyBlock = ({
 postID,
}) => {
  const post = usePostById(postID);

  if (post) {
    ...
  }
};
```

You can also pass a function to lookup the post type when passed the post id.
This function must return a string that is the post type.

```jsx
const MyBlock = ({
 postID,
}) => {
  const myCustomPostTypeLookup = (id) => (
    myCustomPostTypeMap[id]
  );

  const post = usePostById(postID, myCustomPostTypeLookup);

  if (post) {
    ...
  }
};
```

You are also able to pass options to the underlying API query. For example,
here is how we would get a post with the Edit context.

```jsx
const MyBlock = ({
 postID,
}) => {
  const post = usePostById(postID, null, { context: 'edit' });

  if (post) {
    ...
  }
};
```

The hook returns `null` while it is still looking up the post type or waiting
for the post to load, and otherwise returns whatever `usePost` returns (which
may be `undefined`).

## TypeScript Support

`usePostById` returns a `WP_REST_API_Post` from `wp-types` by default. Pass
your own post shape to type custom fields or registered meta.

```ts
const post = usePostById<Event>(postID);
// --> Event | null | undefined
```

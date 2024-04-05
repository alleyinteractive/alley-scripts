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


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

This function must return a string that is the post type.

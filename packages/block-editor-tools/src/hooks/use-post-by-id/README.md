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

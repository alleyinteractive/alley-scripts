# Custom Hooks: usePost

A custom React hook to retrieve post data given a post ID and post type.

## Usage

```jsx
const MyBlock = ({
 postID,
 postType = 'post',
 options = { context: 'view' }
}) => {
  const post = usePost(postID, postType, options);

  if (post) {
    ...
  }
};
```

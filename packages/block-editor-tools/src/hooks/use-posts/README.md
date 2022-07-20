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

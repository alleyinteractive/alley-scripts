# Custom Hooks: useTerms

 A custom React hook that wraps useEntityProp for working with a post's terms.
 It returns an array that contains a copy of a post's terms assigned from a
 given taxonomy as well as a helper function that sets the terms for a given
 post. This hook is intended to reduce boilerplate code in components that
 need to update a post's terms. By default, it operates on terms for the
 current post, but you can optionally pass a post type and post ID in order to
 get and set terms for an arbitrary post.

## Usage

### Editing the Current Post's Terms

```jsx
const MyComponent = ({
  taxonomy,
}) => {
  const [terms, setTerms] = useTerms(null, null, taxonomy);

  return (
    <SelectControl
      label={__('My Terms')}
      multiple
      onChange={(next) => setTerms(next)}
      options={options}
      value={terms}
    />
  );
};
```

### Editing Another Post's Terms

```jsx
const MyComponent = ({
  postId,
  postType,
  taxonomy,
}) => {
  const [terms, setTerms] = useTerms(postType, postId, taxonomy);

  return (
    <SelectControl
      label={__('My Terms')}
      multiple
      onChange={(next) => setTerms(next)}
      options={options}
      value={terms}
    />
  );
};
```

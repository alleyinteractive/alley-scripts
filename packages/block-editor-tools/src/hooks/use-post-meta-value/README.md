# Custom Hooks: usePostMetaValue

A custom React hook that wraps `useEntityProp` for working with a specific post
meta value. It returns a tuple with the value for the meta key as well as a
setter for the meta value. This hook is intended to reduce boilerplate code
in components that need to read and write post meta. It differs from
`usePostMeta` in that it operates only on one specific meta key/value pair.
By default, it operates on post meta for the current post, but you can
optionally pass a post type and post ID in order to get and set post meta
for an arbitrary post.

The setter function accepts either a value or an updater function, which works
exactly like `useState`. See [the docs on `useState` for more information](https://react.dev/reference/react/useState#updating-state-based-on-the-previous-state).

## Usage

### Editing the Current Post's Meta

```jsx
function MyComponent() {
  const [value, setValue] = usePostMetaValue('my_meta_key');

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain')}
      onChange={setValue}
      value={value}
    />
  );
}
```

### Editing Another Post's Meta

```jsx
function MyComponent({ id, type = 'post' }) {
  const [value, setValue] = usePostMetaValue('my_meta_key', type, id);

  return (
    <TextControl
      label={__("Another Post's Meta Key", 'your-textdomain')}
      onChange={setValue}
      value={value}
    />
  );
}
```

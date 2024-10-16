# Custom Hooks: usePostMeta

A custom React hook that wraps useEntityProp for working with post meta. This
hook is intended to reduce boilerplate code in components that need to read
and write post meta. By default, it operates on post meta for the current post,
but you can optionally pass a post type and post ID in order to get and set
post meta for an arbitrary post.

This hook returns a tuple of all available post meta and a function to update
the post meta. The setter function accepts either a full object or a function
which receives the most up-to-date post meta. **It is advised to use the
function form of the setter when updating post meta or else you may risk
overwriting changes made by other components.**

When working with single post meta entries, it is recommended to use
`usePostMetaValue` instead. `usePostMeta` is best suited for components that
need to read and write multiple post meta entries at the same time.

## Usage

### Editing the Current Post's Meta

```jsx
function MyComponent() {
  const [{ my_meta_key: metaValue }, setMeta] = usePostMeta();

  const onChangeMeta = (value) => {
    setMeta((old) => ({
      ...old,
      my_meta_key: value,
      last_meta_key: metaValue,
    }));
  };

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain')}
      onChange={onChangeMeta}
      value={metaValue}
    />
  );
}
```

### Editing Another Post's Meta

```jsx
function MyComponent({ id, type }) {
  const [{ my_meta_key: myMetaValue }, setMeta] = usePostMeta(type, id);

  return (
    <TextControl
      label={__("Another Post's Meta Key", 'your-textdomain')}
      onChange={(next) => setMeta((old) => ({ ...old, my_meta_key: next }))}
      value={myMetaValue}
    />
  );
}
```

### Potentially Overwriting Meta

This is an example of what _not_ to do, or at least what to be cautious of when
using the `usePostMeta` setter function.

Note here that the `setMeta` function updates the entire post meta object based
on the current state of `meta` in the component. While not guaranteed, there is
a risk that another component could update the post meta in between the time
that `meta` is read and when `setMeta` is called. This could result in those
changes being overwritten.

```jsx
function MyComponent() {
  const [meta, setMeta] = usePostMeta();

  return (
    <TextControl
      label={__('My Meta Key', 'your-textdomain')}
      onChange={(next) => setMeta({ ...meta, my_meta_key: next })}
      value={meta.my_meta_key}
    />
  );
}
```

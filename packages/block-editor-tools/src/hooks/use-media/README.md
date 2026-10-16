# Custom Hooks: useMedia

A custom React hook for attachment data given an ID.

## Usage

```jsx
const MyBlock = ({
	imageID,
}) => {
  const image = useMedia(imageID);

  ...
};
```

The hook returns `undefined` until the attachment has loaded.

## TypeScript Support

`useMedia` returns a `WP_REST_API_Attachment` from `wp-types` by default. Pass
your own attachment shape to type custom fields.

```ts
const image = useMedia(imageID);
// --> WP_REST_API_Attachment | undefined

const url = image?.source_url;
```

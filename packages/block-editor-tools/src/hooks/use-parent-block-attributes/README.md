# Custom Hooks: useParentBlockAttributes

A custom React hook that returns the current block's parent block attributes.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const parentBlockAttributes = useParentBlockAttributes(clientId);

  ...
};
```

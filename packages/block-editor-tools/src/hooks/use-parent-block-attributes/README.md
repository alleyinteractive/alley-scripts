# Custom Hooks: useParentBlockAttributes

A custom React hook that returns the current block's parent block attributes, or
`null` if the block is at the root level.

## Usage

```jsx
const MyBlock = ({
 clientId
}) => {
  const parentBlockAttributes = useParentBlockAttributes(clientId);

  ...
};
```

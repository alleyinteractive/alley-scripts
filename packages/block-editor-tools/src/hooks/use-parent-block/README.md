# Custom Hooks: useParentBlock

A custom React hook that returns the current block's parent block, or `null` if
the block is at the root level.

## Usage

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlock = useParentBlock(clientId);

  ...
};
```

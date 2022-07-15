# Custom Hooks: useParentBlock

A custom React hook that returns the current block's parent block.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const parentBlock = useParentBlock(clientId);

  ...
};
```

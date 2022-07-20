# Custom Hooks: useInnerBlockIndex

A custom React hook that returns the current block's index relative to its siblings
within a parent block.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const blockIndex = useInnerBlockIndex(clientId);

  ...
};
```

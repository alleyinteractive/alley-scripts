# Custom Hooks: useInnerBlocksCount

A custom React hook that returns the current block's inner block count.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const innerBlocksCount = useInnerBlocksCount(clientId);

  ...
};
```

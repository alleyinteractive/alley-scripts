# Custom Hooks: useInnerBlocks

A custom React hook that returns the current block's inner blocks.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const blocks = useInnerBlocks(clientId);

  ...
};
```

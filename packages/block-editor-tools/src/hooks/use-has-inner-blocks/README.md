# Custom Hooks: useHasInnerBlocks

A custom React hook that determines if a block has inner blocks.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const hasInnerBlocks = useHasInnerBlocks(clientId);

  if (hasInnerBlocks) {
	  ...
  } else {
	  ...
  }

  ...
};
```

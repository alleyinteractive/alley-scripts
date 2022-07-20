# Custom Hooks: useInnerBlocksAttributes

A custom React hook that returns the current blocks' inner block's attributes.

## Usage

```jsx
const MyBlock = ({
	clientId
}) => {
  const innerBlockAttributes = useInnerBlocksAttributes(clientId);

  ...
};
```

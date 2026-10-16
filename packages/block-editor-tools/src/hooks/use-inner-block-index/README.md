# Custom Hooks: useInnerBlockIndex

A custom React hook that returns the current block's index relative to its siblings
within a parent block, or `-1` if it is not found.

## Usage

```jsx
const MyBlock = ({
 clientId
}) => {
  const blockIndex = useInnerBlockIndex(clientId);

  ...
};
```

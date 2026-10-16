# Custom Hooks: useParentClientId

A custom React hook that returns the client id of the parent block of the current block,
or `null` if the block is at the root level.

## Usage

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlockClientId = useParentClientId(clientId);

  ...
};
```

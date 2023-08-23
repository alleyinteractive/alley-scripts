# Custom Hooks: useParentClientId

A custom React hook that returns the client id of the parent block of the current block.

## Usage

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlockClientId = useParentClientId(clientId);

  ...
};
```

# Custom Hooks: useBlockName

A custom React hook that returns the name of a block.

## Usage

```jsx
const MyBlock = ({ clientId }) => {
  const blockName = useBlockName(clientId);

  ...
};
```

```jsx
const MyBlock = ({ clientId }) => {
  const parentBlockClientId = useParentClientId(clientId);
  const parentBlockName = useBlockName(parentBlockClientId);

  ...
};
```

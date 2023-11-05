# Custom Hooks: useTerm

A custom React hook to retrieve term data given a term ID and taxonomy.

## Usage

```jsx
const MyBlock = ({
 termId,
 taxonomy
}) => {
  const termObject = useTerm(termId, taxonomy);

  if (termObject) {
    ...
  }
};
```

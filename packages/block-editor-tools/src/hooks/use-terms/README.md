# Custom Hooks: useTerms

A custom React hook to retrieve multiple terms' data given an array of term IDs and a single taxonomy.

## Usage

```jsx
const MyBlock = ({
	termIds,
}) => {
  const terms = useTerms(termIds, taxonomy);

  if (terms) {
    ...
  }
};
```

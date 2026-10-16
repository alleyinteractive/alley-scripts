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

The hook returns `undefined` until the term has loaded.

## TypeScript Support

`useTerm` returns a `WP_REST_API_Term` from `wp-types` by default. Pass your
own term shape, extending `WP_REST_API_Term`, to type registered meta.

```ts
import type { WP_REST_API_Term } from 'wp-types';

interface Topic extends WP_REST_API_Term {
  meta: { color: string };
}

const topic = useTerm<Topic>(termId, 'topic');
// --> Topic | undefined
```

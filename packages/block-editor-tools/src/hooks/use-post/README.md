# Custom Hooks: usePost

A custom React hook to retrieve post data given a post ID and post type.

## Usage

```jsx
const MyBlock = ({
 postID,
 postType = 'post',
 options = { context: 'view' }
}) => {
  const post = usePost(postID, postType, options);

  if (post) {
    ...
  }
};
```

The hook returns `undefined` until the post has loaded.

## TypeScript Support

`usePost` returns a `WP_REST_API_Post` from `wp-types` by default. Pass your
own post shape, extending `WP_REST_API_Post`, to type custom fields or
registered meta.

```ts
import type { WP_REST_API_Post } from 'wp-types';

interface Event extends WP_REST_API_Post {
  meta: { event_date: string };
}

const event = usePost<Event>(postID, 'event');
// --> Event | undefined
```

import React from 'react';

import usePostMeta, { type PostMetaSetter } from '../use-post-meta';

/**
 * A custom React hook that wraps useEntityProp for working with a specific
 * post meta value. It returns the value for the specified meta key as well as a
 * setter for the meta value. This hook is intended to reduce boilerplate code
 * in components that need to read and write post meta. It differs from
 * usePostMeta in that it operates on a specific meta key/value pair.
 * By default, it operates on post meta for the current post, but you can
 * optionally pass a post type and post ID in order to get and set post meta
 * for an arbitrary post.
 * @template TValue - The meta value type. Defaults to `unknown`.
 * @param {string} metaKey - The meta key for which to manage the value.
 * @param {string|null} postType - Optional. The post type to get and set meta for.
 *                                 Defaults to the post type of the current post.
 * @param {number|null} postId - Optional. The post ID to get and set meta for.
 *                               Defaults to the ID of the current post.
 * @returns {[TValue, PostMetaSetter<TValue>]} A tuple containing the post meta value
 *                                             and a setter function.
 */
const usePostMetaValue = <TValue = unknown>(
  metaKey: string,
  postType: string | null = null,
  postId: number | null = null,
): [TValue, PostMetaSetter<TValue>] => {
  const [meta, setMeta] = usePostMeta<Record<string, TValue>>(postType, postId);

  /**
   * A helper function for setting the value for the meta key that this hook is
   * responsible for.
   * @param {*} value - The value to set for the key. Optionally, this can be a
   *                    function that receives the current value and returns a new
   *                    value.
   */
  const setPostMetaValue: PostMetaSetter<TValue> = React.useCallback(
    (value) => setMeta((oldMeta) => {
      // Any function is treated as an updater, even if TValue is itself a function type.
      const newValue = typeof value === 'function'
        ? (value as (prev: TValue) => TValue)(oldMeta[metaKey])
        : value;
      return { ...oldMeta, [metaKey]: newValue };
    }),
    [metaKey, setMeta],
  );

  return [meta[metaKey], setPostMetaValue];
};

export default usePostMetaValue;

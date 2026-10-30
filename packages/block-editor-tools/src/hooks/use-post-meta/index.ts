import React from 'react';
import { useEntityProp, useEntityId } from '@wordpress/core-data';
import { useSelect, useRegistry } from '@wordpress/data';
import type { PostMeta } from '../types';

export type PostMetaSetter = (next: PostMeta | ((prev: PostMeta) => PostMeta)) => void;

/**
 * A custom React hook that wraps useEntityProp for working with postmeta. This
 * hook is intended to reduce boilerplate code in components that need to read
 * and write postmeta. By default, it operates on postmeta for the current post,
 * but you can optionally pass a post type and post ID in order to get and set
 * post meta for an arbitrary post.
 * @param {string} postType - Optional. The post type to get and set meta for.
 *                            Defaults to the post type of the current post.
 * @param {number} postId - Optional. The post ID to get and set meta for.
 *                          Defaults to the ID of the current post.
 * @returns {array} A tuple containing an object representing postmeta and a setter function.
 */
const usePostMeta = (
  postType: string | null = null,
  postId: number | null = null,
): [PostMeta, PostMetaSetter] => {
  // Ensure that we have a post type.
  const type: string = useSelect((select) => postType || (select('core/editor') as {
    getCurrentPostType: () => string,
  }).getCurrentPostType(), []);

  // Ensure that we have a post ID.
  const providerId = useEntityId('postType', type);
  const id = postId ?? providerId;

  // Create a selector for the latest meta for the setter to optionally use.
  const { getEditedEntityRecord } = (useRegistry() as unknown as {
    select: (store: string) => {
      getEditedEntityRecord: (
        kind: string,
        name: string,
        key: number,
      ) => { meta?: PostMeta } | undefined,
    },
  }).select('core');
  const getLatestMeta = React.useCallback(
    () => getEditedEntityRecord('postType', type, id)?.meta,
    [getEditedEntityRecord, type, id],
  );

  // Get the return value from useEntityProp so we can wrap it for safety.
  const [metaRaw, setMetaRaw] = useEntityProp('postType', type, 'meta', id);

  const setMetaError = React.useCallback(
    () => console.error(`Error attempting to set post meta for post type ${type}. Does it have support for custom-fields?`), // eslint-disable-line no-console
    [type],
  );

  /*
   * Ensure meta is an object and set meta is a function. useEntityProp can
   * return `undefined` if the post type doesn't have support for custom-fields.
   */
  const meta: PostMeta = typeof metaRaw === 'object' ? metaRaw : {};
  const setMeta = (
    typeof setMetaRaw === 'function' ? setMetaRaw : setMetaError
  ) as (value: PostMeta) => void;

  /**
   * Wrapper for the setMeta function that can accept a function as a setter which will get the
   * latest edited meta from the data store.
   *
   * @param {object|function} next - A new value for meta or a function that takes the current value
   *                                 and returns a new value.
   */
  const setMetaSafe: PostMetaSetter = React.useCallback(
    (next) => {
      if (typeof next === 'object') {
        setMeta({ ...next });
      } else if (typeof next === 'function') {
        setMeta({ ...next(getLatestMeta() ?? {}) });
      }
    },
    [setMeta, getLatestMeta],
  );

  return [meta, setMetaSafe];
};

export default usePostMeta;

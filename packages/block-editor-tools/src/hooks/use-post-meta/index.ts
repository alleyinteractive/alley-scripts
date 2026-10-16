import React from 'react';
import { useEntityProp, useEntityId } from '@wordpress/core-data';
import { useSelect, useRegistry } from '@wordpress/data';

import type { EditorSelectors, EntityProp, Registry } from '../store-types';

/**
 * A setter that accepts either a new value or an updater function that
 * receives the latest value and returns a new one.
 */
export type PostMetaSetter<T> = (next: T | ((prev: T) => T)) => void;

/**
 * The tuple returned by `usePostMeta`: the post meta object and its setter.
 */
export type UsePostMetaReturn<
  TMeta extends Record<string, unknown> = Record<string, unknown>,
> = [TMeta, PostMetaSetter<TMeta>];

/**
 * A custom React hook that wraps useEntityProp for working with postmeta. This
 * hook is intended to reduce boilerplate code in components that need to read
 * and write postmeta. By default, it operates on postmeta for the current post,
 * but you can optionally pass a post type and post ID in order to get and set
 * post meta for an arbitrary post.
 * @template TMeta - The post meta shape. Defaults to `Record<string, unknown>`.
 * @param {string|null} postType - Optional. The post type to get and set meta for.
 *                                 Defaults to the post type of the current post.
 * @param {number|null} postId - Optional. The post ID to get and set meta for.
 *                               Defaults to the ID of the current post.
 * @returns {UsePostMetaReturn<TMeta>} A tuple containing an object representing postmeta
 *                                     and a setter function.
 */
const usePostMeta = <TMeta extends Record<string, unknown> = Record<string, unknown>>(
  postType: string | null = null,
  postId: number | null = null,
): UsePostMetaReturn<TMeta> => {
  // Ensure that we have a post type.
  const type = useSelect(
    // Store boundary: `select('core/editor')` is typed as `never` by the installed data types.
    (select) => postType || (select('core/editor') as EditorSelectors).getCurrentPostType(),
    [],
  );

  // Ensure that we have a post ID.
  const providerId = useEntityId('postType', type);
  const id = postId ?? providerId;

  // Create a selector for the latest meta for the setter to optionally use.
  // Store boundary: `useRegistry` is typed as returning `Function`.
  const { getEditedEntityRecord } = (useRegistry() as unknown as Registry).select('core');
  const getLatestMeta = React.useCallback(
    () => getEditedEntityRecord<{ meta?: TMeta }>('postType', type, id)?.meta,
    [getEditedEntityRecord, type, id],
  );

  // Get the return value from useEntityProp so we can wrap it for safety.
  // Store boundary: core-data types the value as `any` and the setter as `Function`.
  const [metaRaw, setMetaRaw] = useEntityProp('postType', type, 'meta', id) as EntityProp<TMeta | undefined>;

  const setMetaError = React.useCallback(
    () => console.error(`Error attempting to set post meta for post type ${type}. Does it have support for custom-fields?`), // eslint-disable-line no-console
    [type],
  );

  /*
   * Ensure meta is an object and set meta is a function. useEntityProp can
   * return `undefined` if the post type doesn't have support for custom-fields.
   */
  const meta = typeof metaRaw === 'object' ? metaRaw : {} as TMeta;
  const setMeta = typeof setMetaRaw === 'function' ? setMetaRaw : setMetaError;

  /**
   * Wrapper for the setMeta function that can accept a function as a setter which will get the
   * latest edited meta from the data store.
   *
   * @param {object|function} next - A new value for meta or a function that takes the current value
   *                                 and returns a new value.
   */
  const setMetaSafe: PostMetaSetter<TMeta> = React.useCallback(
    (next) => {
      if (typeof next === 'object') {
        setMeta({ ...next });
      } else if (typeof next === 'function') {
        // The edited record holds the meta whenever meta can be edited.
        setMeta({ ...next(getLatestMeta() as TMeta) });
      }
    },
    [setMeta, getLatestMeta],
  );

  return [meta, setMetaSafe];
};

export default usePostMeta;

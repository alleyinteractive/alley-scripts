import React from 'react';
import { useEntityProp, useEntityId } from '@wordpress/core-data';
import { useSelect, useRegistry } from '@wordpress/data';

type MetaSetter<T> = T | ((current: T) => T);

/**
 * A custom React hook that wraps useEntityProp for working with postmeta. This
 * hook is intended to reduce boilerplate code in components that need to read
 * and write postmeta. By default, it operates on postmeta for the current post,
 * but you can optionally pass a post type and post ID in order to get and set
 * post meta for an arbitrary post.
 * @param postType - Optional. The post type to get and set meta for.
 *                   Defaults to the post type of the current post.
 * @param postId - Optional. The post ID to get and set meta for.
 *                 Defaults to the ID of the current post.
 * @returns A tuple containing an object representing postmeta and a setter function.
 */
const usePostMeta = <T extends Record<string, unknown> = Record<string, unknown>>(
  postType: string | null = null,
  postId: number | null = null,
): [T, (next: MetaSetter<T>) => void] => {
  // Ensure that we have a post type.
  const type: string = useSelect((select) => postType || (select('core/editor') as {
    getCurrentPostType: () => string,
  }).getCurrentPostType(), []);

  // Ensure that we have a post ID.
  const providerId = useEntityId('postType', type);
  const id = postId ?? providerId;

  // Create a selector for the latest meta for the setter to optionally use.
  // useRegistry is typed as returning Function, so it needs a cast to reach `select`.
  const { getEditedEntityRecord } = (useRegistry() as unknown as {
    select: (store: string) => {
      getEditedEntityRecord: (kind: string, name: string, key: number) => { meta?: T } | undefined,
    },
  }).select('core');
  const getLatestMeta = React.useCallback(
    () => getEditedEntityRecord('postType', type, id)?.meta,
    [getEditedEntityRecord, type, id],
  );

  // Get the return value from useEntityProp so we can wrap it for safety.
  // Its declared `_id` type is string, but it accepts numeric IDs.
  const [metaRaw, setMetaRaw] = useEntityProp('postType', type, 'meta', id as unknown as string);

  const setMetaError = React.useCallback(
    () => console.error(`Error attempting to set post meta for post type ${type}. Does it have support for custom-fields?`), // eslint-disable-line no-console
    [type],
  );

  /*
   * Ensure meta is an object and set meta is a function. useEntityProp can
   * return `undefined` if the post type doesn't have support for custom-fields.
   */
  const meta: T = typeof metaRaw === 'object' ? metaRaw : {};
  const setMeta: (value: T) => void = typeof setMetaRaw === 'function'
    ? setMetaRaw as (value: T) => void
    : setMetaError;

  /**
   * Wrapper for the setMeta function that can accept a function as a setter which will get the
   * latest edited meta from the data store.
   *
   * @param next - A new value for meta or a function that takes the current value
   *               and returns a new value.
   */
  const setMetaSafe = React.useCallback(
    (next: MetaSetter<T>) => {
      if (typeof next === 'object') {
        setMeta({ ...next });
      } else if (typeof next === 'function') {
        setMeta({ ...next(getLatestMeta() as T) });
      }
    },
    [setMeta, getLatestMeta],
  );

  return [meta, setMetaSafe];
};

export default usePostMeta;

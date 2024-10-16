import React from 'react';
import { useEntityProp, useEntityId } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

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
 * @returns {array} An array containing an object representing postmeta and an update function.
 */
const usePostMeta = (postType = null, postId = null) => {
  // Ensure that we have a post type.
  const type = useSelect((select) => postType || select('core/editor').getCurrentPostType(), []);

  // Ensure that we have a post ID.
  const providerId = useEntityId('postType', type);
  const id = postId ?? providerId;

  const getLatestMeta = useSelect(
    (select) => {
      const { getEditedEntityRecord } = select('core');
      return () => getEditedEntityRecord('postType', type, id)?.meta;
    },
    [type, id],
  );

  // Get the return value from useEntityProp so we can wrap it for safety.
  const [metaRaw, setMetaRaw] = useEntityProp('postType', type, 'meta', id);

  // Create a ref to store the current value of meta.
  const metaRef = React.useRef(typeof metaRaw === 'object' ? metaRaw : {});

  /*
   * Ensure set meta is a function. useEntityProp can return `undefined` if the post type doesn't
   * have support for custom-fields.
   */
  const setMeta = typeof setMetaRaw === 'function'
    ? setMetaRaw
    : () => console.error(`Error attempting to set post meta for post type ${type}. Does it have support for custom-fields?`); // eslint-disable-line no-console

  /**
   * Wrapper for the setMeta function that updates the ref as well as the entity prop.
   *
   * @param {object} next - The new value for meta.
   */
  const setMetaSafe = (next) => {
    if (typeof next === 'object') {
      metaRef.current = { ...next };
    } else if (typeof next === 'function') {
      metaRef.current = next(getLatestMeta());
    }
    setMeta(metaRef.current);
  };

  return [metaRef.current, setMetaSafe];
};

export default usePostMeta;

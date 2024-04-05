import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param {int}    postId   The ID for the post to return.
 * @param {string} postType Optional. The post type to select. Default 'post'.
 * @param {object} options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePost = (postId, postType = 'post', options = { context: 'view' }) => useSelect(
  (select) => select(store).getEntityRecord('postType', postType, postId, options),
  [postId, postType],
);

export default usePost;

import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param {int}    postId   The ID for the post to return.
 * @param {string} postType Optional. The post type to select. Defaults to 'post'.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePost = (postId, postType = 'post') => useSelect(
  (select) => select(store).getEntityRecord('postType', postType, postId),
  [postId, postType],
);

export default usePost;

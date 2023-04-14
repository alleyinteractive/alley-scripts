import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import usePost from '../use-post';
/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param int    postId   The ID for the post to return.
 * @param string postType Optional. The post type to select. Default 'post'.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePostById = (postId) => {
  let postType = 'post';
  // const path = addQueryArgs('/wp/v2/search', { include: postId });
  // apiFetch({ path }).then((result) => {
  //   if (result.length > 0) {
  //     postType = result[0].subtype;
  //   }
  //   return null;
  // });
  console.log('postType', postType);
  console.log('postId', postId);
  return usePost(postId, postType);
};

export default usePostById;

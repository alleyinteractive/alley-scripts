import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import usePost from '../use-post';
/**
 * Gets post data for a specific post given its ID. The post type is
 * looked up from the search endpoint, cached, and then passed to usePost.
 *
 * @param int    postId   The ID for the post to return.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePostById = (postId) => {
  const [postTypeCache, setPostTypeCache] = useState({});

  useEffect(() => {
    if (!postId) {
      return;
    }
    if (postTypeCache[postId]) {
      return;
    }
    (async () => {
      const path = addQueryArgs('/wp/v2/search', { include: postId });
      const newPost = await apiFetch({ path });
      setPostTypeCache((prev) => ({ ...prev, [postId]: newPost[0].subtype }));
    })();
  }, [postId, postTypeCache]);
  const postType = postTypeCache[postId];
  return usePost(postId, postType) ?? null;
};

export default usePostById;

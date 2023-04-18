import { useState, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import usePost from '../use-post';
/**
 * Gets post data for a specific post given its ID. The post type is
 * looked up from the search endpoint, cached, and then passed to usePost.
 *
 * @param int    postId   The ID for the post to return.
 * @param function getPost Optional custom function that returns a post object.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePostById = (postId, getPost = null) => {
  const [postTypeCache, setPostTypeCache] = useState({});
  const [resultCache, setResultCache] = useState({});

  useEffect(() => {
    if (resultCache[postId]) {
      return;
    }

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
  }, [postId, postTypeCache, resultCache]);
  if (resultCache[postId]) {
    console.log('using cache');
    return resultCache[postId];
  }

  const postType = postTypeCache[postId];
  let result = {};
  if (getPost) {
    result = getPost(postId);
  }

  result = usePost(postId, postType) ?? null; // eslint-disable-line react-hooks/rules-of-hooks
  setResultCache((prev) => ({ ...prev, [postId]: result }));
  return result;
};

export default usePostById;

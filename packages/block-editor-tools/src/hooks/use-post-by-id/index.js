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
    if (postId && !resultCache[postId]) {
      (async () => {
        if (getPost) {
          const result = await getPost(postId);
          if (!result) {
            console.error(`Custom function to get post with ID ${postId} failed.`);
          } else if (!result.subtype) {
            console.error(`Custom function for getting post with ID ${postId} did not include required subtype property.`);
          } else {
            setPostTypeCache((prev) => ({ ...prev, [postId]: result.subtype }));
          }
        } else {
          const path = addQueryArgs('/wp/v2/search', { include: postId });
          const newPost = await apiFetch({ path });
          // TODO: What if the lookup fails? Should handle error state in some way.
          setPostTypeCache((prev) => ({ ...prev, [postId]: newPost[0].subtype }));
        }
      })();
    }
  }, [postId]); // TODO: Add eslint-ignore here, we only want this to fire when the post ID changes, the other deps are objects and can result in a render loop when they update
  // TODO: See what happens if you pass usePost an empty post type. Does getEntityRecord fail gracefully? Does it result in a REST API request? If it's smart and bails early, great. If not, modify usePost to bail early if post type is empty. That way the hook can be consistently called even if we don't know the post type yet.
  return usePost(postId, postTypeCache[postId] ?? '')
};

export default usePostById;

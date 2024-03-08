import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import usePost from '../use-post';

/**
 * Gets post data for a specific post given its ID. The post type is
 * looked up from the search endpoint, cached, and then passed to usePost.
 *
 * @param {int}      postId   The ID for the post to return.
 * @param {function} getPostType Optional custom function that returns a post type string.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePostById = (postId, getPostType = null) => {
  const [postTypeCache, setPostTypeCache] = useState({});
  const [working, setWorking] = useState(true);

  useEffect(() => {
    setWorking(true);
    if (postId && !postTypeCache[postId]) {
      (async () => {
        if (getPostType) {
          const result = await getPostType(postId);
          if (!result) {
            // eslint-disable-next-line no-console
            console.error(`Custom function to get post with ID ${postId} failed.`);
          } else {
            setPostTypeCache((prev) => ({ ...prev, [postId]: result }));
          }
        } else {
          const path = addQueryArgs('/wp/v2/search', { include: postId });
          const newPost = await apiFetch({ path });
          if (newPost.length > 0) {
            setPostTypeCache((prev) => ({ ...prev, [postId]: newPost[0]?.subtype }));
          }
        }
        setWorking(false);
      })();
    } else if (postId && postTypeCache[postId]) {
      setWorking(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);
  const post = usePost(postId, postTypeCache[postId] ?? '');
  // If we're still fetching the post type, working is true - return null.
  // If we've got the post type, but no post yet (usePost is still working), return null.
  // If we've got the post, return it - or return undefined as returned by usePost.
  return working || (!post && postTypeCache[postId]) ? null : post;
};

export default usePostById;

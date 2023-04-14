import { useState, useEffect } from 'react';
import { useSelect } from '@wordpress/data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
import usePost from '../use-post';
/**
 * Gets post data for a specific post given its ID.
 *
 * @param int    postId   The ID for the post to return.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePostById = (postId) => {
  const [post, setPost] = useState(null);
  useEffect(() => {
    if (!postId) {
      return;
    }
    (async () => {
      const path = addQueryArgs('/wp/v2/search', { include: postId });
      const newPost = await apiFetch({ path });
      setPost(newPost);
    })();
  }, [postId]);
  return post;
};

export default usePostById;

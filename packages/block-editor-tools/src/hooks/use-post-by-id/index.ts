import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post, WP_REST_API_Search_Results } from 'wp-types';

import usePost from '../use-post';

/**
 * A function that returns the post type for a post ID, synchronously or asynchronously.
 * A falsy result is treated as a failed lookup.
 */
type GetPostType = (postId: number) => (
  string | null | undefined | Promise<string | null | undefined>
);

/**
 * Gets post data for a specific post given its ID. The post type is
 * looked up from the search endpoint, cached, and then passed to usePost.
 *
 * @template T - The post shape. Defaults to `WP_REST_API_Post`; pass an extended
 *               type for custom post types or registered meta.
 * @param {number}   postId      The ID for the post to return.
 * @param {function} getPostType Optional custom function that returns a post type string.
 * @param {object}   options     Optional object containing parameters to pass to getEntityRecord.
 * @returns {T | null | undefined} null while the post type or post is still being fetched,
 *                                 otherwise the post object, or undefined as returned by usePost.
 */
// eslint-disable-next-line camelcase
const usePostById = <T extends WP_REST_API_Post = WP_REST_API_Post>(
  postId: number,
  getPostType: GetPostType | null = null,
  options: object = { context: 'view' },
): T | null | undefined => {
  const [postTypeCache, setPostTypeCache] = useState<Record<number, string>>({});
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
          // eslint-disable-next-line camelcase
          const newPost = await apiFetch<WP_REST_API_Search_Results>({ path });
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
  const post = usePost<T>(postId, postTypeCache[postId] ?? '', options);
  // If we're still fetching the post type, working is true - return null.
  // If we've got the post type, but no post yet (usePost is still working), return null.
  // If we've got the post, return it - or return undefined as returned by usePost.
  return working || (!post && postTypeCache[postId]) ? null : post;
};

export default usePostById;

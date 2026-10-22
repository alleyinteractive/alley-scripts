import { useState, useEffect } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Search_Result } from 'wp-types';

import usePost from '../use-post';

import type { EntityRecordOptions, WP_REST_API_Post } from '../../types'; // eslint-disable-line camelcase

/**
 * A function that returns the post type for a given post ID.
 */
export type GetPostType = (postId: number) => string | Promise<string>;

/**
 * Gets post data for a specific post given its ID. The post type is
 * looked up from the search endpoint, cached, and then passed to usePost.
 *
 * @param {number}   postId   The ID for the post to return.
 * @param {function} getPostType Optional custom function that returns a post type string.
 * @param {object}   options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} The post object, null while the request is resolving, or
 *                   undefined if the post could not be found.
 */
// eslint-disable-next-line camelcase
const usePostById = <T = WP_REST_API_Post>(
  postId: number,
  getPostType: GetPostType | null = null,
  options: EntityRecordOptions = { context: 'view' },
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
          const newPost = await apiFetch<WP_REST_API_Search_Result[]>({ path });
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

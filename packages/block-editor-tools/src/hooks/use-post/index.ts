import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import type { WP_REST_API_Post as WPPost } from 'wp-types';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param postId   The ID for the post to return.
 * @param postType Optional. The post type to select. Default 'post'.
 * @param options Optional object containing parameters to pass to getEntityRecord.
 * @returns The post object, or undefined if not loaded.
 */
const usePost = <T = WPPost>(
  postId: number,
  postType = 'post',
  options: Record<string, unknown> = { context: 'view' },
): T | undefined => {
  const post = useSelect(
    (select) => select(coreStore).getEntityRecord('postType', postType, postId, options),
    [postId, postType],
  );

  return post as T | undefined;
};

export default usePost;

import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post as Post } from 'wp-types';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param postId   The ID for the post to return.
 * @param postType Optional. The post type to select. Default 'post'.
 * @param options  Optional object containing parameters to pass to getEntityRecord.
 * @returns The post object, or undefined if it has not loaded.
 */
const usePost = <T = Post>(
  postId: number,
  postType: string = 'post',
  options: Record<string, unknown> = { context: 'view' },
): T | undefined => useSelect(
    (select) => (select('core') as {
      getEntityRecord: (
        kind: string,
        name: string,
        key: number,
        query: Record<string, unknown>,
      ) => T | undefined,
    }).getEntityRecord('postType', postType, postId, options),
    [postId, postType],
  );

export default usePost;

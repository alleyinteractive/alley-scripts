import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post as Post } from 'wp-types';

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param postIds  A list of post IDs.
 * @param postType Optional. The post type to select. Default 'post'.
 * @returns An array of post objects, or null if they have not loaded.
 */
const usePosts = <T = Post>(
  postIds: number[],
  postType: string = 'post',
): T[] | null => useSelect((select) => {
    const { getEntityRecords } = select('core') as {
      getEntityRecords: (kind: string, name: string, query: Record<string, unknown>) => T[] | null,
    };
    return getEntityRecords(
      'postType',
      postType,
      { include: postIds },
    );
  }, [postIds, postType]);

export default usePosts;

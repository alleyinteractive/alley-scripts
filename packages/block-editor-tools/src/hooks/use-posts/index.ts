import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import type { WP_REST_API_Post as WPPost } from 'wp-types';

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param postIds  A list of post IDs.
 * @param postType Optional. The post type to select. Default 'post'.
 * @returns An array of post objects, or null if not loaded.
 */
const usePosts = <T = WPPost>(postIds: number[], postType = 'post'): T[] | null => useSelect((select) => {
  const { getEntityRecords } = select(coreStore);
  return getEntityRecords(
    'postType',
    postType,
    { include: postIds },
  ) as T[] | null;
}, [postIds, postType]);

export default usePosts;

import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post } from 'wp-types';

type GetEntityRecords<T> = (
  kind: string,
  name: string,
  query?: Record<string, unknown>,
) => T[] | null;

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param postIds  A list of post IDs.
 * @param postType Optional. The post type to select. Default 'post'.
 * @returns An array of returned post objects, or null if they have not resolved yet.
 */
// eslint-disable-next-line camelcase
const usePosts = <T extends WP_REST_API_Post = WP_REST_API_Post>(
  postIds: number[],
  postType: string = 'post',
): T[] | null => {
  const posts = useSelect((select) => {
    const { getEntityRecords }: { getEntityRecords: GetEntityRecords<T> } = select('core');
    return getEntityRecords(
      'postType',
      postType,
      { include: postIds },
    );
  }, [postIds, postType]);

  return posts;
};

export default usePosts;

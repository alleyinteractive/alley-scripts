import { useSelect } from '@wordpress/data';

import type { CoreSelectors, WP_REST_API_Post } from '../../types'; // eslint-disable-line camelcase

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param {number[]} postIds  A list of post IDs.
 * @param {string} postType Optional. The post type to select. Default 'post'.
 * @returns {array} An array of returned post objects, or null while the
 *                  request is resolving.
 */
// eslint-disable-next-line camelcase
const usePosts = <T = WP_REST_API_Post>(
  postIds: number[],
  postType: string = 'post',
): T[] | null => {
  const posts = useSelect((select) => {
    const { getEntityRecords } = select('core') as CoreSelectors;
    return getEntityRecords<T>(
      'postType',
      postType,
      { include: postIds },
    );
  }, [postIds, postType]);

  return posts;
};

export default usePosts;

import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post } from 'wp-types';

import type { CoreSelectors } from '../store-types';

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @template T - The post shape. Defaults to `WP_REST_API_Post`; pass a narrower
 *               type for custom post types, registered meta, or `_fields` queries.
 * @param {number[]} postIds  A list of post IDs.
 * @param {string}   postType Optional. The post type to select. Default 'post'.
 * @returns {T[] | null} An array of post objects, or null if they are not available yet.
 */
// eslint-disable-next-line camelcase
const usePosts = <T extends WP_REST_API_Post = WP_REST_API_Post>(
  postIds: number[],
  postType = 'post',
): T[] | null => useSelect(
    (select) => {
      // Store boundary: `select('core')` is typed as `never` by the installed data types.
      const { getEntityRecords } = select('core') as CoreSelectors;
      return getEntityRecords<T>(
        'postType',
        postType,
        { include: postIds },
      );
    },
    [postIds, postType],
  );

export default usePosts;

import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post } from 'wp-types';

import type { CoreSelectors } from '../store-types';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @template T - The post shape. Defaults to `WP_REST_API_Post`; pass a narrower
 *               type for custom post types, registered meta, or `_fields` queries.
 * @param {number} postId   The ID for the post to return.
 * @param {string} postType Optional. The post type to select. Default 'post'.
 * @param {object} options  Optional object containing parameters to pass to getEntityRecord.
 * @returns {T | undefined} The post object, or undefined if it has not loaded yet.
 */
// eslint-disable-next-line camelcase
const usePost = <T extends WP_REST_API_Post = WP_REST_API_Post>(
  postId: number,
  postType = 'post',
  options: object = { context: 'view' },
): T | undefined => useSelect(
    // Store boundary: `select('core')` is typed as `never` by the installed data types.
    (select) => (select('core') as CoreSelectors)
      .getEntityRecord<T>('postType', postType, postId, options),
    [postId, postType],
  );

export default usePost;

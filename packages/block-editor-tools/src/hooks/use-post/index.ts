import { useSelect } from '@wordpress/data';

import type {
  CoreSelectors,
  EntityRecordOptions,
  WP_REST_API_Post, // eslint-disable-line camelcase
} from '../../types';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param {number} postId   The ID for the post to return.
 * @param {string} postType Optional. The post type to select. Default 'post'.
 * @param {object} options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} The post object, null while the request is resolving, or
 *                   undefined if the post could not be found.
 */
// eslint-disable-next-line camelcase
const usePost = <T = WP_REST_API_Post>(
  postId: number,
  postType: string = 'post',
  options: EntityRecordOptions = { context: 'view' },
): T | null | undefined => {
  const post = useSelect(
    (select) => (select('core') as CoreSelectors)
      .getEntityRecord<T>('postType', postType, postId, options),
    [postId, postType],
  );

  return post;
};

export default usePost;

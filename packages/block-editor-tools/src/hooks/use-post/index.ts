import { useSelect } from '@wordpress/data';
import type { EntityRecord, EntityRecordOptions } from '../types';

/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param {int}    postId   The ID for the post to return.
 * @param {string} postType Optional. The post type to select. Default 'post'.
 * @param {object} options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
const usePost = (
  postId: number,
  postType: string = 'post',
  options: EntityRecordOptions = { context: 'view' },
): EntityRecord | undefined => useSelect(
  (select) => {
    const { getEntityRecord } = select('core') as {
      getEntityRecord: (
        kind: string,
        name: string,
        key: number,
        query: EntityRecordOptions,
      ) => EntityRecord | undefined,
    };
    return getEntityRecord('postType', postType, postId, options);
  },
  [postId, postType],
);

export default usePost;

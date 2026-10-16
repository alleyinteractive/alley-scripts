import { useSelect } from '@wordpress/data';
import type { EntityRecord } from '../types';

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param {array} - postIDs  A list of post IDs.
 * @param {string} - postType Optional. The post type to select. Default 'post'.
 * @returns {object} An object containing a hasResolved property
 *                   and an array of returned post objects.
 */
const usePosts = (
  postIds: number[],
  postType: string = 'post',
): EntityRecord[] | null => useSelect((select) => {
  const { getEntityRecords } = select('core') as {
    getEntityRecords: (
      kind: string,
      name: string,
      query: { include: number[] },
    ) => EntityRecord[] | null,
  };
  return getEntityRecords(
    'postType',
    postType,
    { include: postIds },
  );
}, [postIds, postType]);

export default usePosts;

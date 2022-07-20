import { useSelect } from '@wordpress/data';

/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param {array} - postIDs  A list of post IDs.
 * @param {string} - postType Optional. The post type to select. Default 'post'.
 * @returns {object} An object containing a hasResolved property
 *                   and an array of returned post objects.
 */
const usePosts = (postIds, postType = 'post') => useSelect(
  (select) => {
    const { getEntityRecords } = select('core');
    return getEntityRecords(
      'postType',
      postType,
      { include: postIds },
    );
  }, [postIds, postType],
);

export default usePosts;

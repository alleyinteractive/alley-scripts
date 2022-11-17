export default usePosts;
/**
 * Gets post data for a set of posts given their IDs and post type.
 *
 * @param {array} - postIDs  A list of post IDs.
 * @param {string} - postType Optional. The post type to select. Default 'post'.
 * @returns {object} An object containing a hasResolved property
 *                   and an array of returned post objects.
 */
declare function usePosts(postIds: any, postType?: string): object;

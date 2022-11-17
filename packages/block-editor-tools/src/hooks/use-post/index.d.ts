export default usePost;
/**
 * Gets post data for a specific post given its ID and post type.
 *
 * @param int    postId   The ID for the post to return.
 * @param string postType Optional. The post type to select. Default 'post'.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned post object.
 */
declare function usePost(postId: any, postType?: string): object;

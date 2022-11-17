export default usePostMetaValue;
/**
 * A custom React hook that wraps useEntityProp for working with a specific
 * post meta value. It returns the value for the specified meta key as well as a
 * setter for the meta value. This hook is intended to reduce boilerplate code
 * in components that need to read and write post meta. It differs from
 * usePost Meta in that it operates on a specific meta key/value pair.
 * By default, it operates on post meta for the current post, but you can
 * optionally pass a post type and post ID in order to get and set post meta
 * for an arbitrary post.
 * @param {string} metaKey - The meta key for which to manage the value.
 * @param {string} postType - Optional. The post type to get and set meta for.
 *                            Defaults to the post type of the current post.
 * @param {number} postId - Optional. The post ID to get and set meta for.
 *                          Defaults to the ID of the current post.
 * @returns {array} An array containing the post meta value and an update function.
 */
declare function usePostMetaValue(metaKey: string, postType?: string, postId?: number): any[];

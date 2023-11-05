import { store } from '@wordpress/editor';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * A custom React hook that wraps useEntityProp for working with a post's terms.
 * It returns an array that contains a copy of a post's terms assigned from a
 * given taxonomy as well as a helper function that sets the terms for a given
 * post. This hook is intended to reduce boilerplate code in components that
 * need to update a post's terms. By default, it operates on terms for the
 * current post, but you can optionally pass a post type and post ID in order to
 * get and set terms for an arbitrary post.
 * @param {string} postType - Optional. The post type to get and set terms for.
 *                            Defaults to the post type of the current post.
 * @param {number} postId - Optional. The post ID to get and set terms for.
 *                          Defaults to the ID of the current post.
 * @param {string} taxonomy - Optional. The taxonomy for the terms.
 *                            Defaults to `categories`.
 * @returns {array} An array containing an object representing terms and an
 *                  update function.
 */
const useTerms = (postType = null, postId = null, taxonomy = 'categories') => {
  // Ensures that we have a post type, since we need it as an argument to useEntityProp.
  const type = useSelect((select) => postType || select(store).getCurrentPostType(), []);

  // Get the terms and a function for updating terms from useEntityProp.
  const [terms, setTerms] = useEntityProp('postType', type, taxonomy, postId);

  /**
   * A helper function for updating terms that accepts an array of term IDs.
   * @param {array} values - The term IDs to set.
   */
  const setPostTerms = (values) => setTerms(values);

  return [terms, setPostTerms];
};

export default useTerms;

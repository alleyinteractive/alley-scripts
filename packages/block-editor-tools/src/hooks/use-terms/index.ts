import React from 'react';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

type EditorSelectors = {
  getCurrentPostType: () => string;
};

type UseTermsReturn = [
  number[] | undefined,
  (values: number[]) => void,
];

/**
 * A custom React hook that wraps useEntityProp for working with a post's terms.
 * It returns an array that contains a copy of a post's terms assigned from a
 * given taxonomy as well as a helper function that sets the terms for a given
 * post. This hook is intended to reduce boilerplate code in components that
 * need to update a post's terms. By default, it operates on terms for the
 * current post, but you can optionally pass a post type and post ID in order to
 * get and set terms for an arbitrary post.
 *
 * @param postType Optional. The post type to get and set terms for.
 *                 Defaults to the post type of the current post.
 * @param postId   Optional. The post ID to get and set terms for.
 *                 Defaults to the ID of the current post.
 * @param taxonomy Optional. The taxonomy for the terms. Defaults to `categories`.
 * @returns An array containing the term IDs and an update function.
 */
const useTerms = (
  postType: string | null = null,
  postId: number | null = null,
  taxonomy: string = 'categories',
): UseTermsReturn => {
  // Ensures that we have a post type, since we need it as an argument to useEntityProp.
  const type: string = useSelect((select) => {
    const editor = select('core/editor') as EditorSelectors;
    return postType || editor.getCurrentPostType();
  }, []);

  // Get the terms and a function for updating terms from useEntityProp.
  const [terms, setTerms] = useEntityProp(
    'postType',
    type,
    taxonomy,
    postId as unknown as string | undefined,
  );

  /**
   * A helper function for updating terms that accepts an array of term IDs.
   *
   * @param values The term IDs to set.
   */
  const setPostTerms = React.useCallback((values: number[]) => setTerms(values), [setTerms]);

  return [terms, setPostTerms];
};

export default useTerms;

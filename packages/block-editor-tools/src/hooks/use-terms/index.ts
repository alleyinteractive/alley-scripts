import React from 'react';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import type { EditorSelectors, EntityProp } from '../store-types';

/**
 * A custom React hook that wraps useEntityProp for working with a post's terms.
 * It returns an array that contains the IDs of a post's terms assigned from a
 * given taxonomy as well as a helper function that sets the terms for a given
 * post. This hook is intended to reduce boilerplate code in components that
 * need to update a post's terms. By default, it operates on terms for the
 * current post, but you can optionally pass a post type and post ID in order to
 * get and set terms for an arbitrary post.
 * @param {string|null} postType - Optional. The post type to get and set terms for.
 *                                 Defaults to the post type of the current post.
 * @param {number|null} postId - Optional. The post ID to get and set terms for.
 *                               Defaults to the ID of the current post.
 * @param {string} taxonomy - Optional. The taxonomy for the terms (its REST base).
 *                            Defaults to `categories`.
 * @returns {[number[] | undefined, function]} A tuple containing the assigned term IDs
 *                                             (undefined if not available) and a setter
 *                                             that accepts an array of term IDs.
 */
const useTerms = (
  postType: string | null = null,
  postId: number | null = null,
  taxonomy = 'categories',
): [number[] | undefined, (values: number[]) => void] => {
  // Ensures that we have a post type, since we need it as an argument to useEntityProp.
  const type = useSelect(
    // Store boundary: `select('core/editor')` is typed as `never` by the installed data types.
    (select) => postType || (select('core/editor') as EditorSelectors).getCurrentPostType(),
    [],
  );

  // Get the terms and a function for updating terms from useEntityProp.
  // Store boundary: core-data types the record ID as `string` and the setter as `Function`.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [terms, setTerms] = useEntityProp('postType', type, taxonomy, postId as any) as EntityProp<number[] | undefined>;

  /**
   * A helper function for updating terms that accepts an array of term IDs.
   * @param {number[]} values - The term IDs to set.
   */
  const setPostTerms = React.useCallback((values: number[]) => setTerms(values), [setTerms]);

  return [terms, setPostTerms];
};

export default useTerms;

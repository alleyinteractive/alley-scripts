import React from 'react';
import { useEntityProp } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

import type { EditorSelectors } from '../../types';

/**
 * A setter for a post's terms. Accepts an array of term IDs.
 */
export type PostTermsSetter = (values: number[]) => void;

/**
 * A custom React hook that wraps useEntityProp for working with a post's terms.
 * It returns an array that contains a copy of a post's terms assigned from a
 * given taxonomy as well as a helper function that sets the terms for a given
 * post. This hook is intended to reduce boilerplate code in components that
 * need to update a post's terms. By default, it operates on terms for the
 * current post, but you can optionally pass a post type and post ID in order to
 * get and set terms for an arbitrary post.
 * @param {string|null} postType - Optional. The post type to get and set terms for.
 *                            Defaults to the post type of the current post.
 * @param {number|null} postId - Optional. The post ID to get and set terms for.
 *                          Defaults to the ID of the current post.
 * @param {string} taxonomy - Optional. The taxonomy for the terms.
 *                            Defaults to `categories`.
 * @returns {array} An array containing an object representing terms and an
 *                  update function.
 */
const useTerms = (
  postType: string | null = null,
  postId: number | null = null,
  taxonomy: string = 'categories',
): [number[], PostTermsSetter] => {
  // Ensures that we have a post type, since we need it as an argument to useEntityProp.
  const type: string = useSelect(
    (select) => postType || (select('core/editor') as EditorSelectors).getCurrentPostType(),
    [],
  );

  // Get the terms and a function for updating terms from useEntityProp.
  // useEntityProp treats `null` and `undefined` IDs the same (falls back to the current entity).
  // Its `_id` parameter is typed as a string upstream, but numeric post IDs are what it expects.
  const [terms, setTerms] = useEntityProp(
    'postType',
    type,
    taxonomy,
    (postId ?? undefined) as unknown as string | undefined,
  );

  /**
   * A helper function for updating terms that accepts an array of term IDs.
   * @param {array} values - The term IDs to set.
   */
  const setPostTerms: PostTermsSetter = React.useCallback(
    (values) => setTerms(values),
    [setTerms],
  );

  return [terms, setPostTerms];
};

export default useTerms;

import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../store-types';

/**
 * Get all children blocks of any given block.
 *
 * @param {string} clientId The block client ID.
 * @returns {BlockInstance[]} An array of child blocks.
 */
const useInnerBlocks = (clientId: string): BlockInstance[] => useSelect(
  // Store boundary: the block-editor `store` export is typed as `any`.
  (select) => (select(store) as BlockEditorSelectors).getBlocks(clientId),
  [clientId],
);

export default useInnerBlocks;

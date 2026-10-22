import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import type { Block, BlockEditorSelectors } from '../../types';

/**
 * Get all children blocks of any given block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} An array of child blocks.
 */
const useInnerBlocks = (clientId?: string | null): Block[] => useSelect(
  (select) => (select(store) as BlockEditorSelectors).getBlocks(clientId),
  [clientId],
);

export default useInnerBlocks;

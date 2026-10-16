import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../types';

/**
 * Get all children blocks of any given block.
 *
 * @param clientId The block client ID, or null for root blocks.
 * @returns An array of child blocks.
 */
const useInnerBlocks = (clientId: string | null): BlockInstance[] => useSelect(
  (select) => (select(store) as BlockEditorSelectors).getBlocks(clientId),
  [clientId],
);

export default useInnerBlocks;

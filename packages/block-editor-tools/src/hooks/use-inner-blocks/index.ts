import { useSelect } from '@wordpress/data';
import type { BlockEditorSelectors, BlockInstance } from '../types';

/**
 * Get all children blocks of any given block.
 *
 * @param clientId The block client ID.
 * @returns An array of child blocks.
 */
const useInnerBlocks = (clientId: string | null): BlockInstance[] => useSelect(
  (select) => (select('core/block-editor') as BlockEditorSelectors).getBlocks(clientId),
  [clientId],
);

export default useInnerBlocks;

import { useSelect } from '@wordpress/data';
import type { BlockEditorSelectors } from '../types';

/**
 * Get the name of a block.
 *
 * @param clientId The block client ID.
 * @returns String of the block name, otherwise null.
 */
const useBlockName = (clientId: string): string | null => useSelect(
  (select) => (select('core/block-editor') as BlockEditorSelectors).getBlockName(clientId),
  [clientId],
);

export default useBlockName;

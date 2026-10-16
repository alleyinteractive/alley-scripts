import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../types';

/**
 * Gets the parent block from a specific block.
 *
 * @param clientId The block client ID.
 * @returns Parsed block object, otherwise null.
 */
const useParentBlock = (clientId: string): BlockInstance | null => useSelect(
  (select) => {
    const {
      getBlock,
      getBlockRootClientId,
    } = select(store) as BlockEditorSelectors;

    // Get parent block client ID.
    const rootBlockClientId = getBlockRootClientId(clientId);

    if (!rootBlockClientId) {
      return null;
    }

    // Get parent block.
    return getBlock(rootBlockClientId);
  },
  [clientId],
);

export default useParentBlock;

import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import type { Block, BlockEditorSelectors } from '../../types';

/**
 * Gets the parent block from a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {object} Parsed block object, otherwise null.
 */
const useParentBlock = (clientId: string): Block | null => useSelect(
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

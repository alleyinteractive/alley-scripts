import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../store-types';

/**
 * Gets the parent block from a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {BlockInstance | null} Parsed block object, otherwise null.
 */
const useParentBlock = (clientId: string): BlockInstance | null => useSelect(
  (select) => {
    const {
      getBlock,
      getBlockRootClientId,
    } = select(store) as BlockEditorSelectors; // Store boundary: `store` is typed as `any`.

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

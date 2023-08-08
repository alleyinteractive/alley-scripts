import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Gets the parent block from a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {Object} Parsed block object, otherwise null.
 */
const useParentBlock = (clientId) => useSelect(
  (select) => {
    const {
      getBlock,
      getBlockRootClientId,
    } = select(store);

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

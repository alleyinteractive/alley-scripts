import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Gets the parent block for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {string} String of the parent block, otherwise null.
 */
const useParentBlock = (clientId) => useSelect(
  (select) => select(store).getBlockRootClientId(clientId),
  [clientId],
);

export default useParentBlock;

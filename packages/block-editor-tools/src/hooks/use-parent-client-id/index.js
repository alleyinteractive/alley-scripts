import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Gets the client ID from the parent block of a specific block.
 *
 * @param {string} clientId The child block client ID.
 * @returns {string} String of the parent block client id, otherwise null.
 */
const useParentClientId = (clientId) => useSelect(
  (select) => select(store).getBlockRootClientId(clientId),
  [clientId],
);

export default useParentClientId;

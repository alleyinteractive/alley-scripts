import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Gets the parent block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} The parent block attributes.
 */
const useParentBlockAttributes = (clientId) => useSelect(
  (select) => {
    const {
      getBlockAttributes,
      getBlockRootClientId,
    } = select(store);

    // Get parent block client ID.
    const rootBlockClientId = getBlockRootClientId(clientId);

    if (!rootBlockClientId) {
      return null;
    }

    // Get parent block attributes.
    return getBlockAttributes(rootBlockClientId);
  },
  [clientId],
);

export default useParentBlockAttributes;

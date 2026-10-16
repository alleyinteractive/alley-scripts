import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Gets the parent block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} The parent block attributes.
 */
const useParentBlockAttributes = (
  clientId: string,
): Record<string, unknown> | null => useSelect(
  (select) => {
    const {
      getBlockAttributes,
      getBlockRootClientId,
    } = select(store) as {
      getBlockAttributes: (id: string) => Record<string, unknown> | null,
      getBlockRootClientId: (id: string) => string | null,
    };

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

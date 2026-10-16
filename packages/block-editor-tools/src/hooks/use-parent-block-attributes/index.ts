import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../store-types';

/**
 * Gets the parent block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {object | null} The parent block attributes, otherwise null.
 */
const useParentBlockAttributes = (clientId: string): BlockInstance['attributes'] | null => useSelect(
  (select) => {
    const {
      getBlockAttributes,
      getBlockRootClientId,
    } = select(store) as BlockEditorSelectors; // Store boundary: `store` is typed as `any`.

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

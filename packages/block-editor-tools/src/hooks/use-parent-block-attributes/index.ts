import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../types';

/**
 * Gets the parent block attributes for a specific block.
 *
 * @param clientId The block client ID.
 * @returns The parent block attributes.
 */
const useParentBlockAttributes = (clientId: string): Record<string, unknown> | null => useSelect(
  (select) => {
    const {
      getBlockAttributes,
      getBlockRootClientId,
    } = select(store) as BlockEditorSelectors;

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

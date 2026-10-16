import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../store-types';

/**
 * Gets the client ID from the parent block of a specific block.
 *
 * @param {string} clientId The child block client ID.
 * @returns {string | null} String of the parent block client id, otherwise null.
 */
const useParentClientId = (clientId: string): string | null => useSelect(
  // Store boundary: the block-editor `store` export is typed as `any`.
  (select) => (select(store) as BlockEditorSelectors).getBlockRootClientId(clientId),
  [clientId],
);

export default useParentClientId;

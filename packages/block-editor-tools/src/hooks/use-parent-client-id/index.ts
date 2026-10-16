import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../types';

/**
 * Gets the client ID from the parent block of a specific block.
 *
 * @param clientId The child block client ID.
 * @returns String of the parent block client id, otherwise null.
 */
const useParentClientId = (clientId: string): string | null => useSelect(
  (select) => (select(store) as BlockEditorSelectors).getBlockRootClientId(clientId),
  [clientId],
);

export default useParentClientId;

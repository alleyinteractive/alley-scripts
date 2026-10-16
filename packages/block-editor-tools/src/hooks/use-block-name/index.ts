import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

import type { BlockEditorSelectors } from '../store-types';

/**
 * Get the name of a block.
 *
 * @param {string|null} clientId The block client ID.
 * @returns {string | null} String of the block name, otherwise null.
 */
const useBlockName = (clientId: string | null): string | null => useSelect(
  // Store boundary: the block-editor `store` export is typed as `any`.
  (select) => (select(store) as BlockEditorSelectors).getBlockName(clientId),
  [clientId],
);

export default useBlockName;

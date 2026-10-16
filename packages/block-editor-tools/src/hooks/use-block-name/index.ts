import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

type BlockEditorSelectors = {
  getBlockName: (clientId: string) => string | null;
};

/**
 * Get the name of a block.
 *
 * @param clientId The block client ID.
 * @returns String of the block name, otherwise null.
 */
const useBlockName = (clientId: string): string | null => useSelect(
  (select) => {
    const { getBlockName } = select(store) as unknown as BlockEditorSelectors;
    return getBlockName(clientId);
  },
  [clientId],
);

export default useBlockName;

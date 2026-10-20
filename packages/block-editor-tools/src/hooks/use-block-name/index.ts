import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Get the name of a block.
 *
 * @param {string} clientId The block client ID.
 * @returns {string} String of the block name, otherwise null.
 */
const useBlockName = (clientId: string): string | null => useSelect(
  (select) => {
    const { getBlockName } = select(store) as {
      getBlockName: (id: string) => string | null,
    };
    return getBlockName(clientId);
  },
  [clientId],
);

export default useBlockName;

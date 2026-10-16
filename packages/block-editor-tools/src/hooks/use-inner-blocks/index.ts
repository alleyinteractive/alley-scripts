import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import type { Block } from '../types';

/**
 * Get all children blocks of any given block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} An array of child blocks.
 */
const useInnerBlocks = (clientId: string): Block[] => useSelect(
  (select) => {
    const { getBlocks } = select(store) as {
      getBlocks: (id: string) => Block[],
    };
    return getBlocks(clientId);
  },
  [clientId],
);

export default useInnerBlocks;

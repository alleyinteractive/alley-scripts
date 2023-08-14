import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

/**
 * Get all children blocks of any given block.
 *
 * @param {string} clientId The block client ID.
 * @returns {Array} An array of child blocks.
 */
const useInnerBlocks = (clientId) => useSelect(
  (select) => select(store).getBlocks(clientId)[0]?.innerBlocks || [],
  [clientId],
);

export default useInnerBlocks;

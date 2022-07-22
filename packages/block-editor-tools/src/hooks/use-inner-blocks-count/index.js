// Internal dependencies.
import { useInnerBlocks } from '@/hooks';

/**
 * Gets the total count of all child blocks for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {integer} The count of all child blocks.
 */
const useInnerBlocksCount = (clientId) => useInnerBlocks(clientId).length;

export default useInnerBlocksCount;

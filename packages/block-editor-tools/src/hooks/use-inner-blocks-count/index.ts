// Internal dependencies.
import { useInnerBlocks } from '..';

/**
 * Gets the total count of all child blocks for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {integer} The count of all child blocks.
 */
const useInnerBlocksCount = (clientId: string): number => useInnerBlocks(clientId).length;

export default useInnerBlocksCount;

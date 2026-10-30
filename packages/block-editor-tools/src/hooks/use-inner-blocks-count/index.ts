// Internal dependencies.
import { useInnerBlocks } from '..';

/**
 * Gets the total count of all child blocks for a specific block.
 *
 * @param clientId The block client ID.
 * @returns The count of all child blocks.
 */
const useInnerBlocksCount = (clientId: string): number => useInnerBlocks(clientId).length;

export default useInnerBlocksCount;

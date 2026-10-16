import useInnerBlocksCount from '../use-inner-blocks-count';

/**
 * Determines if a specific block has inner blocks.
 *
 * @param clientId The block client ID.
 * @returns True if the block contains inner blocks, otherwise false.
 */
const useHasInnerBlocks = (clientId: string): boolean => useInnerBlocksCount(clientId) > 0;

export default useHasInnerBlocks;

import useInnerBlocksCount from '@alleyinteractive/block-editor-tools';

/**
 * Determines if a specific block has inner blocks.
 *
 * @param {string} clientId The block client ID.
 * @returns {boolean} True if the block contains inner blocks, otherwise false.
 */
const useHasInnerBlocks = (clientId) => useInnerBlocksCount(clientId) > 0;

export default useHasInnerBlocks;

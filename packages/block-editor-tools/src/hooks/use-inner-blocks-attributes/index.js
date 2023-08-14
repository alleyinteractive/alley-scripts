import { useInnerBlocks } from '..';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} An array of child block attributes.
 */
const useInnerBlocksAttributes = (clientId) => useInnerBlocks(clientId)
  .map((block) => block.attributes);

export default useInnerBlocksAttributes;

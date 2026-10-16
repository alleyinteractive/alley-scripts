import type { BlockInstance } from '@wordpress/blocks';

import useInnerBlocks from '../use-inner-blocks';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {object[]} An array of child block attributes.
 */
const useInnerBlocksAttributes = (clientId: string): BlockInstance['attributes'][] => useInnerBlocks(clientId)
  .map((block) => block.attributes);

export default useInnerBlocksAttributes;

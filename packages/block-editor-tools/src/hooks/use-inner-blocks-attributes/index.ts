import { useInnerBlocks } from '..';
import type { Block } from '../types';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} An array of child block attributes.
 */
const useInnerBlocksAttributes = (clientId: string): Block['attributes'][] => useInnerBlocks(clientId)
  .map((block) => block.attributes);

export default useInnerBlocksAttributes;

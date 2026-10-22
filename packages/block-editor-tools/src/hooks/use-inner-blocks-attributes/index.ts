import { useInnerBlocks } from '..';

import type { BlockAttributes } from '../../types';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param {string} clientId The block client ID.
 * @returns {array} An array of child block attributes.
 */
const useInnerBlocksAttributes = (clientId: string): BlockAttributes[] => useInnerBlocks(clientId)
  .map((block) => block.attributes);

export default useInnerBlocksAttributes;

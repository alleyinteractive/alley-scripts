import type { BlockInstance } from '@wordpress/blocks';
import useInnerBlocks from '../use-inner-blocks';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param clientId The block client ID.
 * @returns An array of child block attributes.
 */
const useInnerBlocksAttributes = (
  clientId: string,
): BlockInstance['attributes'][] => useInnerBlocks(clientId).map((block) => block.attributes);

export default useInnerBlocksAttributes;

import useInnerBlocks from '../use-inner-blocks';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param clientId The block client ID.
 * @returns An array of child block attributes.
 */
const useInnerBlocksAttributes = <T extends Record<string, unknown> = Record<string, unknown>>(
  clientId: string,
): T[] => useInnerBlocks(clientId).map((block) => block.attributes as T);

export default useInnerBlocksAttributes;

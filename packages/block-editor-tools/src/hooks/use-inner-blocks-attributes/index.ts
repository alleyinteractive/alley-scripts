import { useInnerBlocks } from '..';

/**
 * Gets all child block attributes for a specific block.
 *
 * @param clientId The block client ID.
 * @returns An array of child block attributes.
 */
const useInnerBlocksAttributes = (clientId: string): Record<string, unknown>[] => useInnerBlocks(
  clientId,
).map((block) => block.attributes);

export default useInnerBlocksAttributes;

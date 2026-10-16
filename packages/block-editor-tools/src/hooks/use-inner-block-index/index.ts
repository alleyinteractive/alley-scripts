// Internal dependencies.
import useInnerBlocks from '../use-inner-blocks';
import useParentBlock from '../use-parent-block';

/**
 * Gets the current index of a specific block relative to its siblings.
 *
 * @param {string} clientId The block client ID.
 * @returns {number} The block index, or -1 if it is not found.
 */
const useInnerBlockIndex = (clientId: string): number => {
  // Get the parent block.
  const parentBlockClientId = useParentBlock(clientId);

  // Get all children of that parent block.
  // Known bug preserved by this type-only conversion: this passes the parent block object,
  // or null, where useInnerBlocks expects a client ID.
  // @ts-expect-error -- BlockInstance | null is not assignable to string.
  const childBlocks = useInnerBlocks(parentBlockClientId);

  // No child blocks found.
  if (!childBlocks) {
    // Returns -1 to match the `not found` value from `findIndex`.
    return -1;
  }

  // Get the index.
  return childBlocks.findIndex((block) => block.clientId === clientId);
};

export default useInnerBlockIndex;

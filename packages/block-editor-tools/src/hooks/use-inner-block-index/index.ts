// Internal dependencies.
import useInnerBlocks from '../use-inner-blocks';
import useParentClientId from '../use-parent-client-id';

/**
 * Gets the current index of a specific block relative to its siblings.
 *
 * @param clientId The block client ID.
 * @returns The block index, or -1 if it is not found.
 */
const useInnerBlockIndex = (clientId: string): number => {
  // Get the parent block.
  const parentBlockClientId = useParentClientId(clientId);

  // Get all children of that parent block.
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

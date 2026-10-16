import useInnerBlocks from '../use-inner-blocks';
import useParentBlock from '../use-parent-block';

/**
 * Gets the current index of a specific block relative to its siblings.
 *
 * @param clientId The block client ID.
 * @returns The block index.
 */
const useInnerBlockIndex = (clientId: string): number => {
  // Get the parent block.
  const parentBlockClientId = useParentBlock(clientId);

  // Get all children of that parent block.
  // Note: this passes the parent block object rather than its client ID, which is the long-standing
  // behavior of this hook. The cast keeps that behavior unchanged while satisfying the compiler.
  const childBlocks = useInnerBlocks(parentBlockClientId as unknown as string);

  // No child blocks found.
  if (!childBlocks) {
    // Returns -1 to match the `not found` value from `findIndex`.
    return -1;
  }

  // Get the index.
  return childBlocks.findIndex((block) => block.clientId === clientId);
};

export default useInnerBlockIndex;

import useInnerBlocks from '@alleyinteractive/block-editor-tools';
import useParentBlock from '@alleyinteractive/block-editor-tools';

/**
 * Gets the current index of a specific block relative to its sibilings.
 *
 * @param {string} clientId The block client ID.
 * @returns {integer} The block index.
 */
const useInnerBlockIndex = (clientId) => {
  // Get the parent block.
  const parentBlockClientId = useParentBlock(clientId);

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
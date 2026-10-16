import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

type BlockEditorSelectors = {
  getBlock: (clientId: string) => BlockInstance | null;
  getBlockRootClientId: (clientId: string) => string | null;
};

/**
 * Gets the parent block from a specific block.
 *
 * @param clientId The block client ID.
 * @returns Parsed block object, otherwise null.
 */
const useParentBlock = (clientId: string): BlockInstance | null => {
  const parentBlock = useSelect((select) => {
    const {
      getBlock,
      getBlockRootClientId,
    } = select(store) as unknown as BlockEditorSelectors;

    // Get parent block client ID.
    const rootBlockClientId = getBlockRootClientId(clientId);

    if (!rootBlockClientId) {
      return null;
    }

    // Get parent block.
    return getBlock(rootBlockClientId);
  }, [clientId]);

  return parentBlock;
};

export default useParentBlock;

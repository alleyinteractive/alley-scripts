import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

type BlockEditorSelectors = {
  getBlockAttributes: (clientId: string) => BlockInstance['attributes'] | null;
  getBlockRootClientId: (clientId: string) => string | null;
};

/**
 * Gets the parent block attributes for a specific block.
 *
 * @param clientId The block client ID.
 * @returns The parent block attributes, otherwise null.
 */
const useParentBlockAttributes = (clientId: string): BlockInstance['attributes'] | null => {
  const attributes = useSelect((select) => {
    const {
      getBlockAttributes,
      getBlockRootClientId,
    } = select(store) as unknown as BlockEditorSelectors;

    // Get parent block client ID.
    const rootBlockClientId = getBlockRootClientId(clientId);

    if (!rootBlockClientId) {
      return null;
    }

    // Get parent block attributes.
    return getBlockAttributes(rootBlockClientId);
  }, [clientId]);

  return attributes;
};

export default useParentBlockAttributes;

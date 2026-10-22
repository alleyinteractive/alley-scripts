import { store } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';

type BlockEditorSelectors = {
  getBlockRootClientId: (clientId: string) => string | null;
};

/**
 * Gets the client ID from the parent block of a specific block.
 *
 * @param clientId The child block client ID.
 * @returns String of the parent block client id, otherwise null.
 */
const useParentClientId = (clientId: string): string | null => {
  const parentClientId = useSelect((select) => {
    const { getBlockRootClientId } = select(store) as unknown as BlockEditorSelectors;
    return getBlockRootClientId(clientId);
  }, [clientId]);

  return parentClientId;
};

export default useParentClientId;

import { store } from '@wordpress/block-editor';
import type { BlockInstance } from '@wordpress/blocks';
import { useSelect } from '@wordpress/data';

type BlockEditorSelectors = {
  getBlocks: (clientId?: string) => BlockInstance[];
};

/**
 * Get all children blocks of any given block.
 *
 * @param clientId The block client ID.
 * @returns An array of child blocks.
 */
const useInnerBlocks = (clientId: string): BlockInstance[] => {
  const innerBlocks = useSelect((select) => {
    const { getBlocks } = select(store) as unknown as BlockEditorSelectors;
    return getBlocks(clientId);
  }, [clientId]);

  return innerBlocks;
};

export default useInnerBlocks;

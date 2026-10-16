import { useSelect } from '@wordpress/data';
import type { BlockEditorSelectors } from '../types';

/**
 * Gets the parent block attributes for a specific block.
 *
 * @param clientId The block client ID.
 * @returns The parent block attributes, otherwise null.
 */
const useParentBlockAttributes = <T extends Record<string, unknown> = Record<string, unknown>>(
  clientId: string,
): T | null => useSelect(
    (select) => {
      const {
        getBlockAttributes,
        getBlockRootClientId,
      } = select('core/block-editor') as BlockEditorSelectors;

      // Get parent block client ID.
      const rootBlockClientId = getBlockRootClientId(clientId);

      if (!rootBlockClientId) {
        return null;
      }

      // Get parent block attributes.
      return getBlockAttributes(rootBlockClientId) as T | null;
    },
    [clientId],
  );

export default useParentBlockAttributes;

import { useSelect } from '@wordpress/data';

import type { EditorSelectors } from '../types';

/**
 * Get the current post ID.
 *
 * @returns Returns the ID of the post currently being edited,
 *          or null if the post has not yet been saved or the redux store
 *          is not initialized.
 */
const useCurrentPostId = (): number | null => useSelect((select) => {
  const editorStore = select('core/editor') as EditorSelectors | undefined;
  return editorStore ? editorStore.getCurrentPostId() : null;
}, []);

export default useCurrentPostId;

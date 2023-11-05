import { store } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';

/**
 * Get the current post ID.
 *
 * @returns {?number} Returns the ID of the post currently being edited,
 *                    or null if the post has not yet been saved or the redux store
 *                    is not initialized.
 */
const useCurrentPostId = () => useSelect((select) => {
  const editorStore = select(store);
  return editorStore ? editorStore.getCurrentPostId() : null;
}, []);

export default useCurrentPostId;

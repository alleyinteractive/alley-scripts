import { useSelect } from '@wordpress/data';

/**
 * Gets the current post ID.
 *
 * @returns {?number} Returns the ID of the post currently being edited,
 *                    or null if the post has not yet been saved or the redux store
 *                    is not initialized.
 */
const useCurrentPostId = () => useSelect((select) => {
  const editorStore = select('core/editor');
  return editorStore ? editorStore.getCurrentPostId() : null;
}, []);

export default useCurrentPostId;

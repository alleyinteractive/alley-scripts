import { useSelect } from '@wordpress/data';

/**
 * Gets the current post ID.
 *
 * @returns {integer} The current post ID.
 */
const useCurrentPostId = () => useSelect((select) => {
  const editorStore = select('core/editor');
  return editorStore ? editorStore.getCurrentPostId() : null;
}, []);

export default useCurrentPostId;

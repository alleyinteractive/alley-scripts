import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Get current theme.
 *
 * @returns {?string} Returns the current active theme,
 *                    or null if the redux store is not initialized.
 */
const useCurrentTheme = () => useSelect((select) => {
  const editorStore = select(store);
  return editorStore ? editorStore.getCurrentTheme()?.stylesheet : null;
}, []);

export default useCurrentTheme;

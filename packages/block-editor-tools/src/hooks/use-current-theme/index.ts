import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Get current theme.
 *
 * @returns Returns the current active theme,
 *          or null if the redux store is not initialized.
 */
const useCurrentTheme = (): string | null | undefined => useSelect((select) => {
  const editorStore = select(coreStore);
  return editorStore ? editorStore.getCurrentTheme()?.stylesheet : null;
}, []);

export default useCurrentTheme;

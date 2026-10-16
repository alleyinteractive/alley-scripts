import { useSelect } from '@wordpress/data';

/**
 * Get current theme.
 *
 * @returns Returns the current active theme,
 *          or null if the redux store is not initialized.
 */
const useCurrentTheme = (): string | null | undefined => useSelect((select) => {
  const editorStore = select('core') as {
    getCurrentTheme: () => { stylesheet: string } | null,
  } | undefined;
  return editorStore ? editorStore.getCurrentTheme()?.stylesheet : null;
}, []);

export default useCurrentTheme;

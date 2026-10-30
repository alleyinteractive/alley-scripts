import { useSelect } from '@wordpress/data';

type CoreSelectors = {
  getCurrentTheme: () => { stylesheet: string } | undefined | null;
};

/**
 * Get current theme.
 *
 * @returns Returns the current active theme, or null if the redux store is not initialized.
 *          (May be undefined if the theme has no stylesheet.)
 */
const useCurrentTheme = (): string | null | undefined => useSelect((select) => {
  const editorStore = select('core') as CoreSelectors | undefined;
  return editorStore ? editorStore.getCurrentTheme()?.stylesheet : null;
}, []);

export default useCurrentTheme;

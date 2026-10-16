import { useSelect } from '@wordpress/data';

import type { CoreSelectors } from '../store-types';

/**
 * Get current theme.
 *
 * @returns {string | null | undefined} Returns the current active theme's stylesheet,
 *                                      undefined if the theme has not loaded yet,
 *                                      or null if the redux store is not initialized.
 */
const useCurrentTheme = (): string | null | undefined => useSelect((select) => {
  // Store boundary: `select('core')` is typed as `never` by the installed data types.
  const editorStore = select('core') as CoreSelectors | undefined;
  return editorStore ? editorStore.getCurrentTheme()?.stylesheet : null;
}, []);

export default useCurrentTheme;

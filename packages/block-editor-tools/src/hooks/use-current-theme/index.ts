import { useSelect } from '@wordpress/data';

import type { CoreSelectors } from '../../types';

/**
 * Get current theme.
 *
 * @returns {?string} Returns the current active theme,
 *                    or null if the redux store is not initialized.
 */
const useCurrentTheme = (): string | null | undefined => useSelect((select) => {
  const editorStore = select('core') as CoreSelectors | undefined;
  return editorStore ? editorStore.getCurrentTheme()?.stylesheet : null;
}, []);

export default useCurrentTheme;

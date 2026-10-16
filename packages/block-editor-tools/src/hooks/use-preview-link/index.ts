import { useSelect } from '@wordpress/data';

import type { EditorSelectors } from '../../types';

/**
 * Get preview link.
 *
 * @returns {?string} The preview link for the post currently being edited.
 */
const usePreviewLink = (): string | null => useSelect(
  (select) => (select('core/editor') as EditorSelectors).getEditedPostPreviewLink(),
  [],
);

export default usePreviewLink;

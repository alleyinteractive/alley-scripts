import { useSelect } from '@wordpress/data';

import type { EditorSelectors } from '../types';

/**
 * Get preview link.
 */
const usePreviewLink = (): string | undefined => useSelect(
  (select) => (select('core/editor') as EditorSelectors).getEditedPostPreviewLink(),
  [],
);

export default usePreviewLink;

import { useSelect } from '@wordpress/data';

import type { EditorSelectors } from '../store-types';

/**
 * Get preview link.
 *
 * @returns {string | undefined} The preview link for the post being edited.
 */
const usePreviewLink = (): string | undefined => useSelect(
  // Store boundary: `select('core')` is typed as `never`. Known bug preserved by this type-only
  // conversion: this selector lives on `core/editor`, so it is typed as that store declares it.
  (select) => (select('core') as Pick<EditorSelectors, 'getEditedPostPreviewLink'>)
    .getEditedPostPreviewLink(),
  [],
);

export default usePreviewLink;

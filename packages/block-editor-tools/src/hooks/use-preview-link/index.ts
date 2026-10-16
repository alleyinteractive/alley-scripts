import { useSelect } from '@wordpress/data';

/**
 * Get preview link.
 *
 * @returns The preview link for the post being edited.
 */
const usePreviewLink = (): string | undefined => useSelect((select) => (select('core/editor') as {
  getEditedPostPreviewLink: () => string | undefined,
}).getEditedPostPreviewLink(), []);

export default usePreviewLink;

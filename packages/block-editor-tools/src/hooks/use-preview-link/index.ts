import { useSelect } from '@wordpress/data';

type CoreSelectors = {
  getEditedPostPreviewLink: () => string | undefined;
};

/**
 * Get preview link.
 *
 * @returns The preview link for the post being edited, or undefined if there isn't one.
 */
const usePreviewLink = (): string | undefined => useSelect((select) => {
  const { getEditedPostPreviewLink }: CoreSelectors = select('core');
  return getEditedPostPreviewLink();
}, []);

export default usePreviewLink;

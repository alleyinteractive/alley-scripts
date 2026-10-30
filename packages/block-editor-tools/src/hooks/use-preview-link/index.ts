import { useSelect } from '@wordpress/data';

/**
 * Get preview link.
 *
 * @returns string
 */
const usePreviewLink = (): string | undefined => useSelect((select) => {
  const { getEditedPostPreviewLink } = select('core') as {
    getEditedPostPreviewLink: () => string | undefined,
  };
  return getEditedPostPreviewLink();
}, []);

export default usePreviewLink;

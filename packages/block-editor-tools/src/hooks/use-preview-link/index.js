import { useSelect } from '@wordpress/data';

/**
 * Get preview link.
 *
 * @returns string
 */
const usePreviewLink = () => useSelect((select) => select('core/editor').getEditedPostPreviewLink(), []);

export default usePreviewLink;

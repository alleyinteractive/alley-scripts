import { useSelect } from '@wordpress/data';

/**
 * Get preview link.
 *
 * @returns string
 */
const usePreviewLink = () => useSelect((select) => select('core').getEditedPostPreviewLink(), []);

export default usePreviewLink;

import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Get preview link.
 *
 * @returns string
 */
const usePreviewLink = () => useSelect((select) => select(store).getEditedPostPreviewLink(), []);

export default usePreviewLink;

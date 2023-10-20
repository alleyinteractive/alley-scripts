import { useSelect } from '@wordpress/data';

/**
 * Gets the current post ID.
 *
 * @returns {integer} The current post ID.
 */
const useCurrentPostId = () => useSelect((select) => select('core/editor').getCurrentPostId(), []);

export default useCurrentPostId;

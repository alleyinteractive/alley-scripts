import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Gets media data for a specific attachment.
 *
 * @param {int} mediaId Media Id.
 * @returns {object} Media data.
 */
const useMedia = (mediaId) => useSelect(
  (select) => select(store).getMedia(mediaId),
  [mediaId],
);

export default useMedia;

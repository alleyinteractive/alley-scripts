import { useSelect } from '@wordpress/data';
import type { MediaObject } from '../../services/media/get-media-url';

/**
 * Gets media data for a specific attachment.
 *
 * @param {int} mediaId Media Id.
 * @returns {object} Media data.
 */
const useMedia = (mediaId: number): MediaObject | undefined => useSelect(
  (select) => {
    const { getMedia } = select('core') as {
      getMedia: (id: number) => MediaObject | undefined,
    };
    return getMedia(mediaId);
  },
  [mediaId],
);

export default useMedia;

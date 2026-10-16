import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Attachment as Attachment } from 'wp-types';

/**
 * Gets media data for a specific attachment.
 *
 * @param mediaId Media Id.
 * @returns Media data, or undefined if it has not loaded.
 */
const useMedia = (mediaId: number): Attachment | undefined => useSelect(
  (select) => (select('core') as {
    getMedia: (id: number) => Attachment | undefined,
  }).getMedia(mediaId),
  [mediaId],
);

export default useMedia;

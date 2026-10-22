import { useSelect } from '@wordpress/data';

import type { CoreSelectors, WP_REST_API_Attachment } from '../../types'; // eslint-disable-line camelcase

/**
 * Gets media data for a specific attachment.
 *
 * @param {number} mediaId Media Id.
 * @returns {object} Media data.
 */
// eslint-disable-next-line camelcase
const useMedia = (mediaId: number): WP_REST_API_Attachment | null | undefined => useSelect(
  (select) => (select('core') as CoreSelectors).getMedia(mediaId),
  [mediaId],
);

export default useMedia;

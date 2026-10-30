import { useSelect } from '@wordpress/data';
import type { WP_REST_API_Attachment as WPAttachment } from 'wp-types';

import type { CoreGeneratedSelectors } from '../types';

/**
 * Gets media data for a specific attachment.
 *
 * @param mediaId Media Id.
 * @returns Media data.
 */
const useMedia = (mediaId: number): WPAttachment | undefined => useSelect(
  (select) => (select('core') as CoreGeneratedSelectors).getMedia(mediaId),
  [mediaId],
);

export default useMedia;

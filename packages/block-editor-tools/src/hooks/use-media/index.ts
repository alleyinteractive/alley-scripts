import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Attachment } from 'wp-types';

import type { CoreSelectors } from '../store-types';

/**
 * Gets media data for a specific attachment.
 *
 * @template T - The attachment shape. Defaults to `WP_REST_API_Attachment`.
 * @param {number} mediaId Media ID.
 * @returns {T | undefined} The attachment object, or undefined if it has not loaded yet.
 */
// eslint-disable-next-line camelcase
const useMedia = <T extends WP_REST_API_Attachment = WP_REST_API_Attachment>(
  mediaId: number,
): T | undefined => useSelect(
    // Store boundary: `select('core')` is typed as `never` by the installed data types.
    (select) => (select('core') as CoreSelectors).getMedia<T>(mediaId),
    [mediaId],
  );

export default useMedia;

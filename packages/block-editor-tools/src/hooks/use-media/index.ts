import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Attachment } from 'wp-types';

/**
 * Gets media data for a specific attachment.
 *
 * @param mediaId Media ID.
 * @returns Media data, or undefined if it has not resolved yet.
 */
// eslint-disable-next-line camelcase
const useMedia = <T extends WP_REST_API_Attachment = WP_REST_API_Attachment>(
  mediaId: number,
): T | undefined => {
  const media = useSelect((select) => {
    const { getMedia }: { getMedia: (id: number) => T | undefined } = select('core');
    return getMedia(mediaId);
  }, [mediaId]);

  return media;
};

export default useMedia;

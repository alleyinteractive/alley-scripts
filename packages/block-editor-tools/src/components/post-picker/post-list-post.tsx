import { sprintf } from '@wordpress/i18n';
import type { WP_REST_API_Attachment } from 'wp-types';
import { useMedia } from '../../hooks';

interface PostListPostProps {
  title: string;
  postType: string,
  featuredImgID: string | unknown,
}

interface Media extends WP_REST_API_Attachment {
  media_details: {
    sizes: {
      thumbnail: {
        source_url: string;
      };
    };
  };
}

/**
 * Displays a single post in the post list post picker modal.
 *
 * @param {obj} atts The attributes of the PostListPost.
 */
const PostListPost = ({
  title,
  postType,
  featuredImgID,
}: PostListPostProps) => {
  const media = useMedia(featuredImgID) as Media;
  const thumbUrl = media?.media_details?.sizes?.thumbnail?.source_url;
  const thumbAlt = media?.alt_text ?? '';

  return (
    <div>
      {thumbUrl ? (<img loading="lazy" src={thumbUrl} alt={thumbAlt} />) : null}
      <strong>
        {title}
      </strong>
      {sprintf(
        ' (%s)',
        postType,
      )}
    </div>
  );
};

export default PostListPost;

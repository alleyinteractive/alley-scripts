import classNames from 'classnames';
import { decodeEntities } from '@wordpress/html-entities';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Attachment } from 'wp-types';
import { image } from '@wordpress/icons';
import { useMedia } from '../../hooks';
import SafeHTML from '../safe-html';

interface PostInterface {
  format?: 'grid' | 'list';
  title: string;
  postType: string,
  attachmentID: string | unknown,
}

// eslint-disable-next-line camelcase
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
 * Displays a single post.
 *
 * @param {obj} atts The attributes of the Post.
 */
const Post = ({
  format,
  title,
  postType,
  attachmentID,
}: PostInterface) => {
  const media = useMedia(attachmentID) as Media;
  const thumbUrl = media?.media_details?.sizes?.thumbnail?.source_url;
  const thumbAlt = media?.alt_text ?? '';

  const postClasses = classNames(
    'post-item',
    format === 'list' ? 'is-format-list' : '',
  );

  return (
    <div className={postClasses}>
      <div className="post-picker-result-image">
        {thumbUrl ? (
          <img
            style={{ maxWidth: '100%', height: 'auto' }}
            loading="lazy"
            src={thumbUrl}
            alt={thumbAlt}
          />
        ) : (
          <div className="result-image-fallback">
            {image}
          </div>
        )}
      </div>
      <SafeHTML
        html={decodeEntities(title)}
        className="post-picker-result-title"
        tag="h3"
      />
      <p className="post-picker-result-type">{postType}</p>
    </div>
  );
};

export default Post;

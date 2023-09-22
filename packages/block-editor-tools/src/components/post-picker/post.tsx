import { sprintf } from '@wordpress/i18n';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Attachment } from 'wp-types';
import styled from 'styled-components';
import { useMedia } from '../../hooks';
import SafeHTML from '../safe-html';

interface PostInterface {
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

// Styled components.
const PostDiv = styled.div`
  align-items: center;
  gap: 4px;
  overflow-wrap: anywhere;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0.5rem 0.75rem;
`;

/**
 * Displays a single post.
 *
 * @param {obj} atts The attributes of the Post.
 */
const Post = ({
  title,
  postType,
  attachmentID,
}: PostInterface) => {
  const media = useMedia(attachmentID) as Media;
  const thumbUrl = media?.media_details?.sizes?.thumbnail?.source_url;
  const thumbAlt = media?.alt_text ?? '';

  return (
    <PostDiv>
      {thumbUrl ? (
        <img
          style={{ maxWidth: '100%', height: 'auto' }}
          loading="lazy"
          src={thumbUrl}
          alt={thumbAlt}
        />
      ) : null}
      <SafeHTML
        html={title}
        className="post-picker-result-title"
        tag="strong"
      />
      {sprintf(
        ' (%s)',
        postType,
      )}
    </PostDiv>
  );
};

export default Post;

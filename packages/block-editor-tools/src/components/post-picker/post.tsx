import styled, { css } from 'styled-components';
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

const Container = styled.div <{ $format?: string }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;

  ${(props) => props.$format === 'list'
    && css`
      align-items: center;
      column-gap: 1rem;
      flex-direction: row;
      width: 100%;
    `};
`;

const Image = styled.div <{ $format?: string }>`
  align-items: center;
  aspect-ratio: 1 / 1;
  background-color: #d6d6d6;
  border-radius: 0.125rem;
  display: flex;
  height: 4.6875rem;
  justify-content: center;
  margin-bottom: 0.8rem;
  width: 4.6875rem;

  img {
    aspect-ratio: 1 / 1;
    border-radius: 0.125rem;
    height: 4.6875rem;
    width: 4.6875rem;
  }

  ${(props) => props.$format === 'list'
    && css`
      height: 2rem;
      margin: 0;
      width: 2rem;

      img {
        height: 2rem;
        width: 2rem;
      }
    `};
`;

const ImageFallback = styled.div <{ $format?: string }>`
  svg {
    fill: #bdbdbd;
    height: 3rem;
    width: 3rem;
  }

  ${(props) => props.$format === 'list'
    && css`
      svg {
        height: 1.4rem;
        width: 1.4rem;
      }
    `};
`;

const StyledSafeHTML = styled(SafeHTML) <{ $format?: string }>`
  // Increase specificity to override core.
  && {
    font-size: 1rem;
    font-weight: 500;
    margin: 0 0 0.3rem;
    text-transform: none;
    word-break: break-word;

    ${(props) => props.$format === 'list'
      && css`
        margin-bottom: 0;
      `};
  }
`;

const ResultType = styled.p <{ $format?: string }>`
  color: inherit;
  font-weight: 500;
  margin: 0;
  text-transform: capitalize;

  ${(props) => props.$format === 'list'
    && css`
      margin-left: auto;
    `};
`;

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

  return (
    <Container $format={format}>
      <Image $format={format}>
        {thumbUrl ? (
          <img
            style={{ maxWidth: '100%', height: 'auto' }}
            loading="lazy"
            src={thumbUrl}
            alt={thumbAlt}
          />
        ) : (
          <ImageFallback $format={format}>
            {image}
          </ImageFallback>
        )}
      </Image>
      <StyledSafeHTML
        html={decodeEntities(title)}
        tag="h3"
        $format={format}
      />
      <ResultType $format={format}>{postType}</ResultType>
    </Container>
  );
};

export default Post;

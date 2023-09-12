import { useState } from '@wordpress/element';
import styled from 'styled-components';
import { JSX } from 'react';

import {
  Button,
  ButtonGroup,
  Spinner,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post } from 'wp-types';

import { usePostById } from '../../hooks';

import SearchModal from './search-modal';
import Post from './post';

interface PostPickerProps {
  allowedTypes?: string[];
  className?: string;
  getPostType?: (id: number) => string;
  onReset: () => void;
  onUpdate: (id: number) => void;
  params?: object;
  // eslint-disable-next-line camelcase
  previewRender?: (post: object | WP_REST_API_Post) => JSX.Element;
  searchEndpoint?: string;
  searchRender?: (post: object) => JSX.Element;
  suppressPostIds?: number[];
  title?: string;
  value: number;
}

// Styled components.
const Container = styled.div`
  display: block;
  position: relative;
`;

const Preview = styled.div`
  border: 1px solid #eee;
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  padding: 0.5rem 0.75rem;
  text-align: center;
`;

const PostPicker = ({
  allowedTypes,
  className,
  getPostType,
  onReset,
  onUpdate,
  params = {},
  previewRender,
  searchEndpoint = '/wp/v2/search',
  searchRender,
  suppressPostIds = [],
  title: pickerTitle = '',
  value = 0,
}: PostPickerProps) => {
  const [showModal, setShowModal] = useState(false);

  const baseUrl = addQueryArgs(
    searchEndpoint,
    {
      type: 'post',
      subtype: allowedTypes ?? 'any',
      ...params,
    },
  );

  // eslint-disable-next-line camelcase
  const post = usePostById(value, getPostType) as any as WP_REST_API_Post;

  const {
    featured_media: featuredMediaId,
    title: {
      rendered: title = '',
    } = {},
    type = '',
  } = post || {};

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const controls = () => (
    <ButtonGroup>
      <Button
        variant="secondary"
        onClick={onReset}
        style={{
          margin: '0 4px',
        }}
      >
        {__('Reset', 'alley-scripts')}
      </Button>
      <Button
        variant="secondary"
        onClick={openModal}
        style={{
          margin: '0 4px',
        }}
      >
        {__('Replace', 'alley-scripts')}
      </Button>
    </ButtonGroup>
  );

  // getEntityRecord returns `null` if the load is in progress.
  if (value !== 0 && post === null) {
    return (
      <Spinner />
    );
  }

  return (
    <Container className={className}>
      {pickerTitle ? (
        <h4>
          {pickerTitle}
        </h4>
      ) : null}
      {value !== 0 && post !== null ? (
        <>
          {previewRender !== undefined ? (
            previewRender(post)
          ) : (
            <Preview>
              <Post
                title={title}
                postType={type}
                attachmentID={featuredMediaId}
              />
            </Preview>
          )}
          {controls()}
        </>
      ) : (
        <Button
          onClick={openModal}
          variant="secondary"
        >
          {__('Select', 'alley-scripts')}
        </Button>
      )}
      {showModal ? (
        <SearchModal
          closeModal={closeModal}
          baseUrl={baseUrl}
          onUpdate={onUpdate}
          searchRender={searchRender}
          suppressPostIds={suppressPostIds}
        />
      ) : null}
    </Container>
  );
};

export default PostPicker;

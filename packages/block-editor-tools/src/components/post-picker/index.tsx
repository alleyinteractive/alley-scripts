import { useState, JSX } from 'react';
import styled from 'styled-components';

import {
  Button,
  ButtonGroup,
  Notice,
  Spinner,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Post } from 'wp-types';

import { usePostById } from '../../hooks';

import SearchModal from './search-modal';
import Post from './post';

import './style.scss';

interface PostPickerProps {
  allowedTypes?: string[];
  className?: string;
  getPostType?: (id: number) => string;
  modalTitle?: string;
  onReset: () => void;
  onUpdate: (id: number) => void;
  params?: object;
  // eslint-disable-next-line camelcase
  previewRender?: (post: object | WP_REST_API_Post) => JSX.Element;
  replaceText?: string;
  resetText?: string;
  searchEndpoint?: string;
  searchRender?: (post: object) => JSX.Element;
  selectText?: string;
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
  modalTitle = __('Select Post', 'alley-scripts'),
  onReset,
  onUpdate,
  params = {},
  previewRender,
  replaceText = __('Replace', 'alley-scripts'),
  resetText = __('Reset', 'alley-scripts'),
  searchEndpoint = '/wp/v2/search',
  searchRender,
  selectText = __('Select', 'alley-scripts'),
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
        {resetText}
      </Button>
      <Button
        variant="secondary"
        onClick={openModal}
        style={{
          margin: '0 4px',
        }}
      >
        {replaceText}
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
      {value !== 0 && post === undefined ? (
        <>
          <Notice
            status="error"
            isDismissible={false}
            className="post-picker-notice"
          >
            <p>
              {sprintf(__('Post %d is no longer available; it has been unpublished or deleted', 'alley-scripts'), value)}
            </p>
          </Notice>
          {controls()}
        </>
      ) : null}
      {value !== 0 && post !== undefined ? (
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
      ) : null}
      {value === 0 ? (
        <Button
          onClick={openModal}
          variant="secondary"
        >
          {selectText}
        </Button>
      ) : null}
      {showModal ? (
        <SearchModal
          closeModal={closeModal}
          baseUrl={baseUrl}
          modalTitle={modalTitle}
          onUpdate={onUpdate}
          searchRender={searchRender}
          suppressPostIds={suppressPostIds}
        />
      ) : null}
    </Container>
  );
};

export default PostPicker;

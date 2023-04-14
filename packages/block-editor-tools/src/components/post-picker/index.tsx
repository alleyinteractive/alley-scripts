/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import styled from 'styled-components';

import apiFetch from '@wordpress/api-fetch';

import {
  Button,
  Spinner,
} from '@wordpress/components';
import { __, sprintf } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
import type { WP_REST_API_Search_Results } from 'wp-types';

import MediaModal from './media-modal';

interface PostPickerProps {
  allowedTypes?: string[];
  className?: string;
  endPoint?: string;
  // icon: string;
  onReset?: () => void;
  onUpdate: (id: number) => void;
  value: number;
}

// Styled components.
const Container = styled.div`
  display: block;
  position: relative;
`;

const Preview = styled.div`
  border: 1px solid #eee;
  margin: 5px 0;
  padding: 0.5rem 0.75rem;
  text-align: center;
`;

interface Post {
  id: number;
  title: string;
  subtype: string;
}

const PostPicker = ({
  allowedTypes,
  className,
  endPoint = '/wp/v2/search',
  // icon,
  onReset,
  onUpdate,
  value = 0,
}: PostPickerProps) => {
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  const baseUrl = addQueryArgs(
    endPoint,
    {
      type: 'post',
      subtype: allowedTypes,
    },
  );

  // Get the post object, if given the post ID.
  const path = addQueryArgs(endPoint, { include: value });
  apiFetch({ path }).then((result) => {
    const posts = result as any as WP_REST_API_Search_Results;
    if (posts.length > 0) {
      setPost(posts[0] as Post);
    }
  });

  // getEntityRecord returns `null` if the load is in progress.
  if (value !== 0 && post === null) {
    return (
      <Spinner />
    );
  }

  const doReset = () => {
    if (onReset !== undefined) {
      onReset();
    }
    setPost(null);
  };

  const controls = () => (
    <Button
      variant="primary"
      onClick={doReset}
    >
      {__('Replace', 'alley-scripts')}
    </Button>
  );

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <Container className={className}>
      {value !== 0 && post !== null ? (
        <>
          <Preview>
            <strong>
              {post.title}
            </strong>
            {sprintf(
              ' (%s)',
              post.subtype,
            )}
          </Preview>
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
        <MediaModal
          closeModal={closeModal}
          baseUrl={baseUrl}
          onUpdate={onUpdate}
          // value={value}
        />
      ) : null}
    </Container>
  );
};

export default PostPicker;

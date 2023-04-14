import React, { useState } from 'react';
import styled from 'styled-components';

import {
  Button,
  Spinner,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { addQueryArgs } from '@wordpress/url';
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

  const baseUrl = addQueryArgs(
    endPoint,
    {
      type: 'post',
      subtype: allowedTypes,
    },
  );

  // Get the post object, if given the post ID.
  const {
    post = null,
  } = useSelect((select) => ({
    // @ts-ignore
    post: value ? select('core').getEntityRecord('postType', 'post', value) : null,
  }), [value]);

  // getEntityRecord returns `null` if the load is in progress.
  if (value !== 0 && post === null) {
    return (
      <Spinner />
    );
  }

  const controls = () => (
    <Button
      variant="primary"
      onClick={onReset}
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

  if (value) {
    return (
      <Container className={className}>
        {controls()}
      </Container>
    );
  }

  return (
    <Container className={className}>
      {value ? (
        <>
          <p>preview or custom preview</p>
          <Button
            variant="secondary"
            onClick={onReset}
          >
            {__('Replace', 'alley-scripts')}
          </Button>
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

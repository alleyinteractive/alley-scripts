import React, { useState } from 'react';

// import apiFetch from '@wordpress/api-fetch';
import {
  Button,
  Modal,
  // Spinner,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import './media-modal.scss';
import PostList from './post-list';

interface MediaModalProps {
  baseUrl: string;
  closeModal: () => void;
  onUpdate: (id: number) => void;
  searchRender?: (post: object) => JSX.Element;
}

const MediaModal = ({
  baseUrl,
  closeModal,
  onUpdate,
  searchRender,
}: MediaModalProps) => {
  const [selected, setSelected] = useState<string | number>();

  const doSelect = () => {
    if (!selected) {
      return;
    }
    onUpdate(selected as number);
    closeModal();
  };

  return (
    <Modal
      isDismissible
      title={__('Select Post', 'alley-scripts')}
      onRequestClose={closeModal}
      closeButtonLabel="Close"
    >
      <PostList
        baseUrl={baseUrl}
        selected={selected}
        setSelected={setSelected}
        searchRender={searchRender}
      />
      <div className="alley-scripts-post-picker__buttons">
        <Button
          variant="secondary"
          onClick={closeModal}
        >
          {__('Cancel', 'alley-careers')}
        </Button>
        <Button
          variant="primary"
          onClick={doSelect}
          disabled={!selected}
        >
          {__('Select', 'alley-careers')}
        </Button>
      </div>
    </Modal>
  );
};

export default MediaModal;

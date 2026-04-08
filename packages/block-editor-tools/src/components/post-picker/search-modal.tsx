import React, { useState, JSX } from 'react';
import styled, { css } from 'styled-components';
import { __ } from '@wordpress/i18n';
import {
  Button,
  Modal,
} from '@wordpress/components';

import PostList from './post-list';

interface SearchModalProps {
  baseUrl: string;
  closeModal: () => void;
  filters?: React.ReactNode;
  format?: 'grid' | 'list';
  modalTitle: string;
  onUpdate: (id: number) => void;
  searchRender?: (post: object) => JSX.Element;
  suppressPostIds?: number[];
}

const StyledModal = styled(Modal) <{ $format?: string }>`
  .components-modal__content {
    width: 85vw;
  }

  .post-list-search {
    margin: 0 0 1rem;
  }

  ${(props) => props.$format === 'list'
    && css`
      .components-modal__content {
        max-width: 37.5rem;
      }
    `}
`;

const Buttons = styled.div`
  clear: both;
  display: block;
  padding-top: 0.75rem;
  text-align: right;
  width: 100%;

  button {
    margin: 0 0 0 0.5rem;
  }
`;

const SearchModal = ({
  baseUrl,
  closeModal,
  filters,
  format = 'grid',
  modalTitle,
  onUpdate,
  searchRender,
  suppressPostIds = [],
}: SearchModalProps) => {
  const [selected, setSelected] = useState<number>();

  const doSelect = () => {
    if (!selected) {
      return;
    }
    onUpdate(selected as number);
    closeModal();
  };

  return (
    <StyledModal
      isDismissible
      title={modalTitle}
      onRequestClose={closeModal}
      closeButtonLabel="Close"
      $format={format}
    >
      <PostList
        baseUrl={baseUrl}
        format={format}
        selected={selected ?? 0}
        setSelected={setSelected}
        searchRender={searchRender}
        suppressPostIds={suppressPostIds}
        filters={filters}
      />
      <Buttons>
        <Button
          variant="secondary"
          onClick={closeModal}
        >
          {__('Cancel', 'alley-scripts')}
        </Button>
        <Button
          variant="primary"
          onClick={doSelect}
          disabled={!selected}
        >
          {__('Select', 'alley-scripts')}
        </Button>
      </Buttons>
    </StyledModal>
  );
};

export default SearchModal;

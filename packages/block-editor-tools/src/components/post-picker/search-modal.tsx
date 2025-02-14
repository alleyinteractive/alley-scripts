import { useState, JSX } from 'react';
import classNames from 'classnames';
import {
  Button,
  Modal,
} from '@wordpress/components';

import { __ } from '@wordpress/i18n';

import './search-modal.scss';
import PostList from './post-list';

interface SearchModalProps {
  baseUrl: string;
  closeModal: () => void;
  format?: 'grid' | 'list';
  modalTitle: string;
  onUpdate: (id: number) => void;
  searchRender?: (post: object) => JSX.Element;
  suppressPostIds?: number[];
}

const SearchModal = ({
  baseUrl,
  closeModal,
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

  const modalClasses = classNames(
    'alley-scripts-post-picker__modal',
    format === 'list' ? 'is-format-list' : 'is-format-grid',
  );

  return (
    <Modal
      className={modalClasses}
      isDismissible
      title={modalTitle}
      onRequestClose={closeModal}
      closeButtonLabel="Close"
    >
      <PostList
        baseUrl={baseUrl}
        format={format}
        selected={selected ?? 0}
        setSelected={setSelected}
        searchRender={searchRender}
        suppressPostIds={suppressPostIds}
      />
      <div className="alley-scripts-post-picker__buttons">
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
      </div>
    </Modal>
  );
};

export default SearchModal;

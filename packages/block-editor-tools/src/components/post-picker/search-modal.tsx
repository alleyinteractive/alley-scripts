import { useState } from '@wordpress/element';

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
  modalTitle: string;
  onUpdate: (id: number) => void;
  searchRender?: (post: object) => JSX.Element;
  suppressPostIds?: number[];
}

const SearchModal = ({
  baseUrl,
  closeModal,
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
    <Modal
      isDismissible
      title={modalTitle}
      onRequestClose={closeModal}
      closeButtonLabel="Close"
    >
      <PostList
        baseUrl={baseUrl}
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

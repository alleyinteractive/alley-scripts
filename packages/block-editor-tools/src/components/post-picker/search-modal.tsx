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
  onUpdate: (id: number) => void;
  searchRender?: (post: object) => JSX.Element;
}

const SearchModal = ({
  baseUrl,
  closeModal,
  onUpdate,
  searchRender,
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
      title={__('Select Post', 'alley-scripts')}
      onRequestClose={closeModal}
      closeButtonLabel="Close"
    >
      <PostList
        baseUrl={baseUrl}
        selected={selected ?? 0}
        setSelected={setSelected}
        searchRender={searchRender}
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

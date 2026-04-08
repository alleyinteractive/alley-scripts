import { ReactNode } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface SortableProps {
  children: ReactNode;
  emptyItem: any;
  list: any[];
  setList: (list: any[]) => void;
  buttonText?: string;
}
export default function Sortable({
  children,
  emptyItem,
  list,
  setList,
  buttonText,
}: SortableProps) {
  return (
    <>
      {children}
      <div style={{ margin: '1em 0' }}>
        <Button
          icon="plus"
          onClick={() => setList([...list, emptyItem])}
          variant="primary"
        >
          {buttonText ?? __('Add Item', 'alley-scripts')}
        </Button>
      </div>
    </>
  );
}

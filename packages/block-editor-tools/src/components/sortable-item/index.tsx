import { ReactNode } from 'react';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface SortableItemProps {
  children: ReactNode;
  index: number;
  list: any[];
  setList: (list: any[]) => void;
  allowAddDelete?: boolean;
}
export default function SortableItem({
  children,
  index,
  list,
  setList,
  allowAddDelete = true,
}: SortableItemProps) {
  return (
    <div>
      <div>
        <Button
          disabled={index === 0}
          icon="arrow-up-alt2"
          label={__('Move up', 'alley-scripts')}
          onClick={() => {
            const newList = [...list];
            newList.splice(index - 1, 0, newList.splice(index, 1)[0]);
            setList(newList);
          }}
        />
        <Button
          disabled={index === list.length - 1}
          icon="arrow-down-alt2"
          label={__('Move down', 'alley-scripts')}
          onClick={() => {
            const newList = [...list];
            newList.splice(index + 1, 0, newList.splice(index, 1)[0]);
            setList(newList);
          }}
        />
        {allowAddDelete ? (
          <Button
            icon="trash"
            label={__('Remove', 'alley-scripts')}
            onClick={() => {
              const newList = [...list];
              newList.splice(index, 1);
              setList(newList);
            }}
          />
        ) : null}
      </div>
      <div>{children}</div>
    </div>
  );
}

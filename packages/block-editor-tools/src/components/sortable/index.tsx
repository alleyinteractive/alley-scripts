import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

interface SortableProps {
  children: React.ReactNode;
  index: number;
  list: any[];
  onUpdate: (list: any[]) => void;
}
export default function Sortable({
  children,
  index,
  list,
  onUpdate,
}: SortableProps) {
  return (
    <div>
      <div>
        <Button
          disabled={index === 0}
          icon="arrow-up-alt2"
          label={__('Move up', 'wpr-core')}
          onClick={() => {
            const newList = [...list];
            newList.splice(index - 1, 0, newList.splice(index, 1)[0]);
            onUpdate(newList);
          }}
        />
        <Button
          disabled={index === list.length - 1}
          icon="arrow-down-alt2"
          label={__('Move down', 'wpr-core')}
          onClick={() => {
            const newList = [...list];
            newList.splice(index + 1, 0, newList.splice(index, 1)[0]);
            onUpdate(newList);
          }}
        />
        <Button
          icon="trash"
          label={__('Remove', 'wpr-core')}
          onClick={() => {
            const newList = [...list];
            newList.splice(index, 1);
            onUpdate(newList);
          }}
        />
      </div>
      <div>{children}</div>
    </div>
  );
}

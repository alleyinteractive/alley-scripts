import { useSelect, useDispatch } from '@wordpress/data';

export default function useOption(name) {
  const selectors = useSelect((select) => {
    const { getEditedEntityRecord, getEntityRecordEdits, isSavingEntityRecord } = select('core');
    const settings = getEditedEntityRecord('root', 'site');
    const edits = getEntityRecordEdits('root', 'site');
    return {
      value: settings?.[name],
      isEdited: !!edits?.[name],
      isSaving: isSavingEntityRecord('root', 'site'),
    };
  }, []);

  const { editEntityRecord, saveEntityRecord } = useDispatch('core');

  function onChange(newValue) {
    editEntityRecord('root', 'site', undefined, {
      [name]: newValue,
    });
  }

  async function onSave() {
    await saveEntityRecord('root', 'site', {
      [name]: selectors.value,
    });
  }

  return {
    ...selectors,
    onChange,
    onSave,
  };
}

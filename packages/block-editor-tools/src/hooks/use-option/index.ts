import React from 'react';
import { Settings } from '@wordpress/core-data';
import { useSelect, useDispatch } from '@wordpress/data';

type ExtendedSettings<T> = (Settings & Record<string, T>);
type RootSiteEntityRecordSelector<T> = (kind:string, name:string) => (
  undefined | ExtendedSettings<T>
);
type RootSiteEntityRecordEditsSelector<T> = (kind:string, name:string) => (
  undefined | Partial<ExtendedSettings<T>>
);
type UseOptionReturn<T> = {
  value: T | undefined;
  isEdited: boolean;
  isSaving: boolean;
  onChange: (newValue: T) => void;
  onSave: () => Promise<void>;
};
type InferOptionType<K extends keyof any> = K extends keyof Settings
  ? UseOptionReturn<Settings[K]>
  : never;

/**
 * Custom hook for managing an option value in the WordPress block editor.
 *
 * @template T - The type of the option value. If the option is a built-in WordPress option, this
 *               type will be inferred from the option key. If the option is a custom option, this
 *               type must be provided.
 */
function useOption<K extends keyof Settings>(key: K): InferOptionType<K>;
// eslint-disable-next-line no-redeclare
function useOption<T>(key: string): UseOptionReturn<T>;
// eslint-disable-next-line no-redeclare
function useOption<K extends keyof Settings | string, T>(
  key: K,
): InferOptionType<K> | UseOptionReturn<T> {
  const selectors = useSelect((select) => {
    const { getEditedEntityRecord, getEntityRecordEdits, isSavingEntityRecord }: {
      getEditedEntityRecord: RootSiteEntityRecordSelector<T>,
      getEntityRecordEdits: RootSiteEntityRecordEditsSelector<T>,
      isSavingEntityRecord: (kind:string, name:string) => boolean,
    } = select('core');
    const settings = getEditedEntityRecord('root', 'site');
    const edits = getEntityRecordEdits('root', 'site');
    return {
      value: settings?.[key],
      isEdited: !!edits?.[key],
      isSaving: isSavingEntityRecord('root', 'site'),
    };
  }, [key]);

  const { editEntityRecord, saveEntityRecord } = useDispatch('core');

  const onChange = React.useCallback((newValue:T) => {
    editEntityRecord('root', 'site', undefined, {
      [key]: newValue,
    });
  }, [key, editEntityRecord]);

  const onSave = React.useCallback(async () => {
    await saveEntityRecord('root', 'site', {
      [key]: selectors.value,
    });
  }, [key, saveEntityRecord, selectors.value]);

  return {
    ...selectors,
    onChange,
    onSave,
  };
}

export default useOption;

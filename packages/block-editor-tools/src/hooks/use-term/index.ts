import { useSelect } from '@wordpress/data';
import type { EntityRecord, EntityRecordOptions } from '../types';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param {int}    termId   The ID for the term to return.
 * @param {string} taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param {object} options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned term object.
 */
const useTerm = (
  termId: number,
  taxonomy: string = 'category',
  options: EntityRecordOptions = { context: 'view' },
): EntityRecord | undefined => useSelect(
  (select) => {
    const { getEntityRecord } = select('core') as {
      getEntityRecord: (
        kind: string,
        name: string,
        key: number,
        query: EntityRecordOptions,
      ) => EntityRecord | undefined,
    };
    return getEntityRecord('taxonomy', taxonomy, termId, options);
  },
  [termId, taxonomy],
);

export default useTerm;

import { useSelect } from '@wordpress/data';

import type {
  CoreSelectors,
  EntityRecordOptions,
  WP_REST_API_Term, // eslint-disable-line camelcase
} from '../../types';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param {number} termId   The ID for the term to return.
 * @param {string} taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param {object} options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} The term object, null while the request is resolving, or
 *                   undefined if the term could not be found.
 */
// eslint-disable-next-line camelcase
const useTerm = <T = WP_REST_API_Term>(
  termId: number,
  taxonomy: string = 'category',
  options: EntityRecordOptions = { context: 'view' },
): T | null | undefined => {
  const term = useSelect(
    (select) => (select('core') as CoreSelectors)
      .getEntityRecord<T>('taxonomy', taxonomy, termId, options),
    [termId, taxonomy],
  );

  return term;
};

export default useTerm;

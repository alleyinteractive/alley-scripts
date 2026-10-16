import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Term } from 'wp-types';

import type { CoreSelectors } from '../store-types';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @template T - The term shape. Defaults to `WP_REST_API_Term`; pass a narrower
 *               type for registered meta or `_fields` queries.
 * @param {number} termId   The ID for the term to return.
 * @param {string} taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param {object} options  Optional object containing parameters to pass to getEntityRecord.
 * @returns {T | undefined} The term object, or undefined if it has not loaded yet.
 */
// eslint-disable-next-line camelcase
const useTerm = <T extends WP_REST_API_Term = WP_REST_API_Term>(
  termId: number,
  taxonomy = 'category',
  options: object = { context: 'view' },
): T | undefined => useSelect(
    // Store boundary: `select('core')` is typed as `never` by the installed data types.
    (select) => (select('core') as CoreSelectors)
      .getEntityRecord<T>('taxonomy', taxonomy, termId, options),
    [termId, taxonomy],
  );

export default useTerm;

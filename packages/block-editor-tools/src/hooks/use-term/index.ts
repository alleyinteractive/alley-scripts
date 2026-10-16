import { useSelect } from '@wordpress/data';
// eslint-disable-next-line camelcase
import type { WP_REST_API_Term as Term } from 'wp-types';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param termId   The ID for the term to return.
 * @param taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param options  Optional object containing parameters to pass to getEntityRecord.
 * @returns The term object, or undefined if it has not loaded.
 */
const useTerm = <T = Term>(
  termId: number,
  taxonomy: string = 'category',
  options: Record<string, unknown> = { context: 'view' },
): T | undefined => useSelect(
    (select) => (select('core') as {
      getEntityRecord: (
        kind: string,
        name: string,
        key: number,
        query: Record<string, unknown>,
      ) => T | undefined,
    }).getEntityRecord('taxonomy', taxonomy, termId, options),
    [termId, taxonomy],
  );

export default useTerm;

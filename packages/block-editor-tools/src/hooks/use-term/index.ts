import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import type { WP_REST_API_Term as WPTerm } from 'wp-types';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param termId   The ID for the term to return.
 * @param taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param options Optional object containing parameters to pass to getEntityRecord.
 * @returns The term object, or undefined if not loaded.
 */
const useTerm = <T = WPTerm>(
  termId: number,
  taxonomy = 'category',
  options: Record<string, unknown> = { context: 'view' },
): T | undefined => {
  const term = useSelect(
    (select) => select(coreStore).getEntityRecord('taxonomy', taxonomy, termId, options),
    [termId, taxonomy],
  );

  return term as T | undefined;
};

export default useTerm;

import { store } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param {int}    termId   The ID for the term to return.
 * @param {string} taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned term object.
 */
const useTerm = (termId, taxonomy = 'category') => useSelect(
  (select) => select(store).getEntityRecord('taxonomy', taxonomy, termId, { context: 'view' }),
  [termId, taxonomy],
);

export default useTerm;

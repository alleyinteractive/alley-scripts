import { useSelect } from '@wordpress/data';

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param {int}    termId   The ID for the term to return.
 * @param {string} taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param {object} options Optional object containing parameters to pass to getEntityRecord.
 * @returns {object} An object containing a hasResolved property
 *                   and the returned term object.
 */
const useTerm = (termId, taxonomy = 'category', options = { context: 'view' }) => useSelect(
  (select) => select('core').getEntityRecord('taxonomy', taxonomy, termId, options),
  [termId, taxonomy],
);

export default useTerm;

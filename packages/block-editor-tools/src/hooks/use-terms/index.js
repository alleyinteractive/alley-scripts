import { useSelect } from '@wordpress/data';

/**
 * Gets term data for a set of terms given their IDs and taxonomy.
 *
 * @param {array} - termIds   A list of term IDs.
 * @param {string} - taxonomy Optional. The taxonomy to select. Default 'category'.
 * @returns {object} An object containing a hasResolved property
 *                   and an array of returned term objects.
 */
const useTerms = (termIds, taxonomy = 'category') => useSelect(
  (select) => {
    const { getEntityRecords } = select('core');
    return getEntityRecords(
      'taxonomy',
      taxonomy,
      { include: termIds },
    );
  }, [termIds, taxonomy],
);

export default useTerms;

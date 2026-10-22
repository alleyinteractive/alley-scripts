import { useSelect } from '@wordpress/data';

type EntityRecordOptions = Record<string, unknown>;
type GetEntityRecord<T> = (
  kind: string,
  name: string,
  key: number,
  query?: EntityRecordOptions,
) => T | undefined;

/**
 * The shape of a term as returned by the REST API. Extend this type to include
 * any additional fields registered for a custom taxonomy.
 */
export interface Term {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  taxonomy: string;
  parent?: number;
  meta?: Record<string, unknown>;
}

/**
 * Gets term data for a specific term given its ID and taxonomy.
 *
 * @param termId   The ID for the term to return.
 * @param taxonomy Optional. The taxonomy name. Defaults to 'category'.
 * @param options  Optional object containing parameters to pass to getEntityRecord.
 * @returns The returned term object, or undefined if it has not resolved yet.
 */
const useTerm = <T extends Term = Term>(
  termId: number,
  taxonomy: string = 'category',
  options: EntityRecordOptions = { context: 'view' },
): T | undefined => {
  const term = useSelect((select) => {
    const { getEntityRecord }: { getEntityRecord: GetEntityRecord<T> } = select('core');
    return getEntityRecord('taxonomy', taxonomy, termId, options);
  }, [termId, taxonomy]);

  return term;
};

export default useTerm;

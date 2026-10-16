/**
 * A block as stored in the block editor store.
 */
export interface Block<T extends Record<string, unknown> = Record<string, unknown>> {
  clientId: string;
  name: string;
  isValid: boolean;
  attributes: T;
  innerBlocks: Block[];
}

/**
 * A post or term object as returned by the core data store.
 */
export type EntityRecord = Record<string, unknown>;

/**
 * Optional query parameters to pass to getEntityRecord.
 */
export type EntityRecordOptions = Record<string, unknown> & { context?: 'view' | 'edit' | 'embed' };

/**
 * Post meta as stored on a post entity.
 */
export type PostMeta = Record<string, unknown>;

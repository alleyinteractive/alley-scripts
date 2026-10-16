/**
 * Internal types for the data-store boundary. Not exported from the package.
 *
 * The installed `@wordpress/*` typings type `select('core')` and
 * `select('core/editor')` as `never`, the block-editor `store` export as
 * `any`, and omit several selectors. Hooks annotate the selectors they call
 * with these shapes so that their public return types are accurate.
 */
import type { BlockInstance } from '@wordpress/blocks';

/**
 * The `core` store selectors used by hooks.
 */
export type CoreSelectors = {
  getCurrentTheme: () => { stylesheet: string } | undefined;
  getEditedEntityRecord: <T>(kind: string, name: string, key: number) => T | undefined;
  getEntityRecord: <T>(kind: string, name: string, key: number, query?: object) => T | undefined;
  getEntityRecords: <T>(kind: string, name: string, query?: object) => T[] | null;
  getMedia: <T>(id: number) => T | undefined;
};

/**
 * The `core/editor` store selectors used by hooks.
 */
export type EditorSelectors = {
  getCurrentPostId: () => number | null;
  getCurrentPostType: () => string;
  getEditedPostPreviewLink: () => string | undefined;
};

/**
 * The `core/block-editor` store selectors used by hooks.
 */
export type BlockEditorSelectors = {
  getBlock: (clientId: string) => BlockInstance | null;
  getBlockAttributes: (clientId: string) => BlockInstance['attributes'] | null;
  getBlockName: (clientId: string | null) => string | null;
  getBlockRootClientId: (clientId: string) => string | null;
  getBlocks: (rootClientId?: string) => BlockInstance[];
};

/**
 * The value, setter and full value returned by `useEntityProp`, which
 * core-data types as `[any, Function, any]`.
 */
export type EntityProp<T> = [T, (value: T) => void, unknown];

/**
 * The data registry returned by `useRegistry`, which `@wordpress/data` types as `Function`.
 */
export type Registry = {
  select: (storeName: 'core') => CoreSelectors;
};

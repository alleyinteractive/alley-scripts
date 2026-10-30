/* eslint-disable camelcase */
import type {
  WP_REST_API_Attachment,
  WP_REST_API_Post,
  WP_REST_API_Term,
} from 'wp-types';

/**
 * A block instance as returned by the `core/block-editor` store.
 */
export interface Block<Attributes = Record<string, any>> {
  attributes: Attributes;
  clientId: string;
  innerBlocks: Block[];
  isValid?: boolean;
  name: string;
}

/**
 * Attributes for a block, keyed by attribute name.
 */
export type BlockAttributes = Record<string, any>;

/**
 * A single size in a media object's `sizes` (media modal) or
 * `media_details.sizes` (REST API) map.
 */
export interface MediaObjectSize {
  source_url?: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * A media object, either from the WordPress REST API (which uses
 * `media_details.sizes[size].source_url` and `source_url`) or from the media
 * modal (which uses `sizes[size].url` and `url`).
 */
export interface MediaObject {
  id?: number;
  media_details?: {
    sizes?: Record<string, MediaObjectSize | undefined>;
    [key: string]: unknown;
  };
  sizes?: Record<string, MediaObjectSize | undefined>;
  source_url?: string;
  url?: string;
  [key: string]: unknown;
}

/**
 * A media object selected or uploaded via the media modal, which always has an ID.
 */
export interface SelectedMedia extends MediaObject {
  id: number;
}

/**
 * Post meta for a post, keyed by meta key.
 */
export type PostMeta = Record<string, any>;

/**
 * Options passed through to `getEntityRecord`.
 */
export interface EntityRecordOptions {
  context?: 'view' | 'edit' | 'embed';
  [key: string]: unknown;
}

/**
 * The subset of `core/block-editor` selectors used by this package.
 */
export interface BlockEditorSelectors {
  getBlock: (clientId: string) => Block | null;
  getBlockAttributes: (clientId: string) => BlockAttributes | null;
  getBlockName: (clientId: string) => string | null;
  getBlockRootClientId: (clientId: string) => string | null;
  getBlocks: (rootClientId?: string | null) => Block[];
}

/**
 * The subset of `core` (core-data) selectors used by this package.
 */
export interface CoreSelectors {
  getCurrentTheme: () => { stylesheet: string; [key: string]: unknown } | undefined;
  getEditedEntityRecord: (
    kind: string,
    name: string,
    recordId?: number | string,
  ) => { meta?: PostMeta; [key: string]: unknown } | undefined;
  getEntityRecord: <T = unknown>(
    kind: string,
    name: string,
    key?: number | string,
    query?: EntityRecordOptions,
  ) => T | null | undefined;
  getEntityRecords: <T = unknown>(
    kind: string,
    name: string,
    query?: Record<string, unknown>,
  ) => T[] | null;
  getMedia: (id: number) => WP_REST_API_Attachment | null | undefined;
}

/**
 * The subset of `core/editor` selectors used by this package.
 */
export interface EditorSelectors {
  getCurrentPostId: () => number | null;
  getCurrentPostType: () => string;
  getEditedPostPreviewLink: () => string | null;
}

export type {
  WP_REST_API_Attachment,
  WP_REST_API_Post,
  WP_REST_API_Term,
};

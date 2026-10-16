import type { BlockInstance } from '@wordpress/blocks';
import type { WP_REST_API_Attachment as WPAttachment } from 'wp-types';

/**
 * Selectors used from the `core/block-editor` store. The package ships no
 * types, and @types/wordpress__block-editor types its store as `any`.
 */
export interface BlockEditorSelectors {
  getBlock: (clientId: string) => BlockInstance | null;
  getBlockAttributes: (clientId: string) => Record<string, unknown> | null;
  getBlockName: (clientId: string) => string | null;
  getBlockRootClientId: (clientId: string) => string | null;
  getBlocks: (rootClientId?: string | null) => BlockInstance[];
}

/**
 * Selectors used from the `core/editor` store. The package ships no types.
 */
export interface EditorSelectors {
  getCurrentPostId: () => number | null;
  getCurrentPostType: () => string;
  getEditedPostPreviewLink: () => string | undefined;
}

/**
 * Selectors from the `core` store that core-data generates at runtime and
 * leaves out of its types.
 */
export interface CoreGeneratedSelectors {
  getMedia: (id: number) => WPAttachment | undefined;
}

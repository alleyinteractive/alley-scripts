import type { BlockInstance } from '@wordpress/blocks';

/**
 * Selectors used from the `core/block-editor` store. The package ships no
 * types, and @types/wordpress__block-editor types its store as `any`.
 */
export interface BlockEditorSelectors {
  getBlock: (clientId: string) => BlockInstance | null;
  getBlockAttributes: (clientId: string) => Record<string, unknown> | null;
  getBlockName: (clientId: string) => string | null;
  getBlockRootClientId: (clientId: string) => string | null;
  getBlocks: (rootClientId?: string) => BlockInstance[];
}

/**
 * Selectors used from the `core/editor` store. The package ships no types.
 */
export interface EditorSelectors {
  getCurrentPostId: () => number | null;
  getCurrentPostType: () => string;
  getEditedPostPreviewLink: () => string | undefined;
}

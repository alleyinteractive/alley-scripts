/**
 * A block as stored in the block editor.
 */
export type BlockInstance<T extends Record<string, unknown> = Record<string, unknown>> = {
  attributes: T;
  clientId: string;
  innerBlocks: BlockInstance[];
  isValid: boolean;
  name: string;
};

/**
 * The `core/block-editor` selectors used by these hooks. `@wordpress/block-editor`
 * does not ship type definitions, so they are declared here.
 */
export type BlockEditorSelectors = {
  getBlock: (clientId: string) => BlockInstance | null;
  getBlockAttributes: (clientId: string) => Record<string, unknown> | null;
  getBlockName: (clientId: string) => string | null;
  getBlockRootClientId: (clientId: string) => string | null;
  getBlocks: (rootClientId?: string | null) => BlockInstance[];
};

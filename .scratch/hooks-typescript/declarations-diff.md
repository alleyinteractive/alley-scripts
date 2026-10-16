# Hook declarations: before / after

Signature-only diff of the emitted `build/hooks/**/*.d.ts` for `@alleyinteractive/block-editor-tools`, JSDoc stripped. "Before" is `cb1b48b`, before the TypeScript conversion. The old declarations referenced types that don't exist (`int`, `integer`, `array`), which TypeScript consumers saw as errors or `any`.

`store-types.d.ts` holds the internal store-boundary types. It is emitted but not exported from the package root.

```diff
--- before/index.d.ts
+++ after/index.d.ts
@@ -1,22 +1,24 @@
-export { default as useBlockName } from "./use-block-name";
-export { default as useCurrentPostId } from "./use-current-post-id";
-export { default as useCurrentTheme } from "./use-current-theme";
-export { default as useDebounce } from "./use-debounce";
-export { default as useHasInnerBlocks } from "./use-has-inner-blocks";
-export { default as useInnerBlocks } from "./use-inner-blocks";
-export { default as useInnerBlocksAttributes } from "./use-inner-blocks-attributes";
-export { default as useInnerBlocksCount } from "./use-inner-blocks-count";
-export { default as useInnerBlocksIndex } from "./use-inner-block-index";
-export { default as useMedia } from "./use-media";
-export { default as useOption } from "./use-option";
-export { default as useParentBlock } from "./use-parent-block";
-export { default as useParentBlockAttributes } from "./use-parent-block-attributes";
-export { default as useParentClientId } from "./use-parent-client-id";
-export { default as usePost } from "./use-post";
-export { default as usePostById } from "./use-post-by-id";
-export { default as usePostMeta } from "./use-post-meta";
-export { default as usePostMetaValue } from "./use-post-meta-value";
-export { default as usePosts } from "./use-posts";
-export { default as usePreviewLink } from "./use-preview-link";
-export { default as useTerm } from "./use-term";
-export { default as useTerms } from "./use-terms";
+export { default as useBlockName } from './use-block-name';
+export { default as useCurrentPostId } from './use-current-post-id';
+export { default as useCurrentTheme } from './use-current-theme';
+export { default as useDebounce } from './use-debounce';
+export { default as useHasInnerBlocks } from './use-has-inner-blocks';
+export { default as useInnerBlocks } from './use-inner-blocks';
+export { default as useInnerBlocksAttributes } from './use-inner-blocks-attributes';
+export { default as useInnerBlocksCount } from './use-inner-blocks-count';
+export { default as useInnerBlocksIndex } from './use-inner-block-index';
+export { default as useMedia } from './use-media';
+export { default as useOption } from './use-option';
+export { default as useParentBlock } from './use-parent-block';
+export { default as useParentBlockAttributes } from './use-parent-block-attributes';
+export { default as useParentClientId } from './use-parent-client-id';
+export { default as usePost } from './use-post';
+export { default as usePostById } from './use-post-by-id';
+export { default as usePostMeta } from './use-post-meta';
+export { default as usePostMetaValue } from './use-post-meta-value';
+export { default as usePosts } from './use-posts';
+export { default as usePreviewLink } from './use-preview-link';
+export { default as useTerm } from './use-term';
+export { default as useTerms } from './use-terms';
+export type { UseOptionReturn } from './use-option';
+export type { PostMetaSetter, UsePostMetaReturn } from './use-post-meta';
--- before/store-types.d.ts
+++ after/store-types.d.ts
@@ -0,0 +1,26 @@
+import type { BlockInstance } from '@wordpress/blocks';
+export type CoreSelectors = {
+    getCurrentTheme: () => {
+        stylesheet: string;
+    } | undefined;
+    getEditedEntityRecord: <T>(kind: string, name: string, key: number) => T | undefined;
+    getEntityRecord: <T>(kind: string, name: string, key: number, query?: object) => T | undefined;
+    getEntityRecords: <T>(kind: string, name: string, query?: object) => T[] | null;
+    getMedia: <T>(id: number) => T | undefined;
+};
+export type EditorSelectors = {
+    getCurrentPostId: () => number | null;
+    getCurrentPostType: () => string;
+    getEditedPostPreviewLink: () => string | undefined;
+};
+export type BlockEditorSelectors = {
+    getBlock: (clientId: string) => BlockInstance | null;
+    getBlockAttributes: (clientId: string) => BlockInstance['attributes'] | null;
+    getBlockName: (clientId: string | null) => string | null;
+    getBlockRootClientId: (clientId: string) => string | null;
+    getBlocks: (rootClientId?: string) => BlockInstance[];
+};
+export type EntityProp<T> = [T, (value: T) => void, unknown];
+export type Registry = {
+    select: (storeName: 'core') => CoreSelectors;
+};
--- before/use-block-name/index.d.ts
+++ after/use-block-name/index.d.ts
@@ -1,2 +1,2 @@
+declare const useBlockName: (clientId: string | null) => string | null;
 export default useBlockName;
-declare function useBlockName(clientId: string): string;
--- before/use-current-post-id/index.d.ts
+++ after/use-current-post-id/index.d.ts
@@ -1,2 +1,2 @@
+declare const useCurrentPostId: () => number | null;
 export default useCurrentPostId;
-declare function useCurrentPostId(): number | null;
--- before/use-current-theme/index.d.ts
+++ after/use-current-theme/index.d.ts
@@ -1,2 +1,2 @@
+declare const useCurrentTheme: () => string | null | undefined;
 export default useCurrentTheme;
-declare function useCurrentTheme(): string | null;
--- before/use-debounce/index.d.ts
+++ after/use-debounce/index.d.ts
@@ -1,2 +1,2 @@
+declare const useDebounce: <T>(value: T, delay: number) => T;
 export default useDebounce;
-declare function useDebounce(value: string, delay: int): string;
--- before/use-has-inner-blocks/index.d.ts
+++ after/use-has-inner-blocks/index.d.ts
@@ -1,2 +1,2 @@
+declare const useHasInnerBlocks: (clientId: string) => boolean;
 export default useHasInnerBlocks;
-declare function useHasInnerBlocks(clientId: string): boolean;
--- before/use-inner-block-index/index.d.ts
+++ after/use-inner-block-index/index.d.ts
@@ -1,2 +1,2 @@
+declare const useInnerBlockIndex: (clientId: string) => number;
 export default useInnerBlockIndex;
-declare function useInnerBlockIndex(clientId: string): integer;
--- before/use-inner-blocks/index.d.ts
+++ after/use-inner-blocks/index.d.ts
@@ -1,2 +1,3 @@
+import type { BlockInstance } from '@wordpress/blocks';
+declare const useInnerBlocks: (clientId: string) => BlockInstance[];
 export default useInnerBlocks;
-declare function useInnerBlocks(clientId: string): array;
--- before/use-inner-blocks-attributes/index.d.ts
+++ after/use-inner-blocks-attributes/index.d.ts
@@ -1,2 +1,3 @@
+import type { BlockInstance } from '@wordpress/blocks';
+declare const useInnerBlocksAttributes: (clientId: string) => BlockInstance['attributes'][];
 export default useInnerBlocksAttributes;
-declare function useInnerBlocksAttributes(clientId: string): array;
--- before/use-inner-blocks-count/index.d.ts
+++ after/use-inner-blocks-count/index.d.ts
@@ -1,2 +1,2 @@
+declare const useInnerBlocksCount: (clientId: string) => number;
 export default useInnerBlocksCount;
-declare function useInnerBlocksCount(clientId: string): integer;
--- before/use-media/index.d.ts
+++ after/use-media/index.d.ts
@@ -1,2 +1,3 @@
+import type { WP_REST_API_Attachment } from 'wp-types';
+declare const useMedia: <T extends WP_REST_API_Attachment = WP_REST_API_Attachment>(mediaId: number) => T | undefined;
 export default useMedia;
-declare function useMedia(mediaId: int): object;
--- before/use-option/index.d.ts
+++ after/use-option/index.d.ts
@@ -1,5 +1,5 @@
 import { Settings } from '@wordpress/core-data';
-type UseOptionReturn<T> = {
+export type UseOptionReturn<T> = {
     value: T | undefined;
     isEdited: boolean;
     isSaving: boolean;
--- before/use-parent-block/index.d.ts
+++ after/use-parent-block/index.d.ts
@@ -1,2 +1,3 @@
+import type { BlockInstance } from '@wordpress/blocks';
+declare const useParentBlock: (clientId: string) => BlockInstance | null;
 export default useParentBlock;
-declare function useParentBlock(clientId: string): object;
--- before/use-parent-block-attributes/index.d.ts
+++ after/use-parent-block-attributes/index.d.ts
@@ -1,2 +1,3 @@
+import type { BlockInstance } from '@wordpress/blocks';
+declare const useParentBlockAttributes: (clientId: string) => BlockInstance['attributes'] | null;
 export default useParentBlockAttributes;
-declare function useParentBlockAttributes(clientId: string): array;
--- before/use-parent-client-id/index.d.ts
+++ after/use-parent-client-id/index.d.ts
@@ -1,2 +1,2 @@
+declare const useParentClientId: (clientId: string) => string | null;
 export default useParentClientId;
-declare function useParentClientId(clientId: string): string;
--- before/use-post/index.d.ts
+++ after/use-post/index.d.ts
@@ -1,2 +1,3 @@
+import type { WP_REST_API_Post } from 'wp-types';
+declare const usePost: <T extends WP_REST_API_Post = WP_REST_API_Post>(postId: number, postType?: string, options?: object) => T | undefined;
 export default usePost;
-declare function usePost(postId: int, postType?: string, options?: object): object;
--- before/use-post-by-id/index.d.ts
+++ after/use-post-by-id/index.d.ts
@@ -1,2 +1,4 @@
+import type { WP_REST_API_Post } from 'wp-types';
+type GetPostType = (postId: number) => (string | null | undefined | Promise<string | null | undefined>);
+declare const usePostById: <T extends WP_REST_API_Post = WP_REST_API_Post>(postId: number, getPostType?: GetPostType | null, options?: object) => T | null | undefined;
 export default usePostById;
-declare function usePostById(postId: int, getPostType?: Function, options?: object): object;
--- before/use-post-meta/index.d.ts
+++ after/use-post-meta/index.d.ts
@@ -1,2 +1,4 @@
+export type PostMetaSetter<T> = (next: T | ((prev: T) => T)) => void;
+export type UsePostMetaReturn<TMeta extends Record<string, unknown> = Record<string, unknown>> = [TMeta, PostMetaSetter<TMeta>];
+declare const usePostMeta: <TMeta extends Record<string, unknown> = Record<string, unknown>>(postType?: string | null, postId?: number | null) => UsePostMetaReturn<TMeta>;
 export default usePostMeta;
-declare function usePostMeta(postType?: string, postId?: number): array;
--- before/use-post-meta-value/index.d.ts
+++ after/use-post-meta-value/index.d.ts
@@ -1,2 +1,3 @@
+import { type PostMetaSetter } from '../use-post-meta';
+declare const usePostMetaValue: <TValue = unknown>(metaKey: string, postType?: string | null, postId?: number | null) => [TValue, PostMetaSetter<TValue>];
 export default usePostMetaValue;
-declare function usePostMetaValue(metaKey: string, postType?: string, postId?: number): array;
--- before/use-posts/index.d.ts
+++ after/use-posts/index.d.ts
@@ -1,2 +1,3 @@
+import type { WP_REST_API_Post } from 'wp-types';
+declare const usePosts: <T extends WP_REST_API_Post = WP_REST_API_Post>(postIds: number[], postType?: string) => T[] | null;
 export default usePosts;
-declare function usePosts(postIds: any, postType?: string): object;
--- before/use-preview-link/index.d.ts
+++ after/use-preview-link/index.d.ts
@@ -1,2 +1,2 @@
+declare const usePreviewLink: () => string | undefined;
 export default usePreviewLink;
-declare function usePreviewLink(): any;
--- before/use-term/index.d.ts
+++ after/use-term/index.d.ts
@@ -1,2 +1,3 @@
+import type { WP_REST_API_Term } from 'wp-types';
+declare const useTerm: <T extends WP_REST_API_Term = WP_REST_API_Term>(termId: number, taxonomy?: string, options?: object) => T | undefined;
 export default useTerm;
-declare function useTerm(termId: int, taxonomy?: string, options?: object): object;
--- before/use-terms/index.d.ts
+++ after/use-terms/index.d.ts
@@ -1,2 +1,2 @@
+declare const useTerms: (postType?: string | null, postId?: number | null, taxonomy?: string) => [number[] | undefined, (values: number[]) => void];
 export default useTerms;
-declare function useTerms(postType?: string | null, postId?: number | null, taxonomy?: string): array;
```

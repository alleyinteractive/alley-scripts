import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { store as blockEditorStore } from '@wordpress/block-editor';
import {
  Button,
  CheckboxControl,
  SelectControl,
  TextControl,
} from '@wordpress/components';
import { EntityProvider } from '@wordpress/core-data';
import { dispatch } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';

import { resolveReadmeLinks } from '../../../../.storybook/components/readme';
import { terms } from '../../../../.storybook/mocks/api';

import {
  useBlockName,
  useCurrentPostId,
  useCurrentTheme,
  useDebounce,
  useHasInnerBlocks,
  useInnerBlocks,
  useInnerBlocksAttributes,
  useInnerBlocksCount,
  useInnerBlocksIndex,
  useMedia,
  useOption,
  useParentBlock,
  useParentBlockAttributes,
  useParentClientId,
  usePost,
  usePostById,
  usePostMeta,
  usePostMetaValue,
  usePosts,
  usePreviewLink,
  useTerm,
  useTerms,
} from './index';

const POST_ID = 100;

const block = (clientId: string, name: string, attributes = {}, innerBlocks: any[] = []) => ({
  attributes,
  clientId,
  innerBlocks,
  isValid: true,
  name,
});

const blocks = [
  block('group', 'core/group', { tagName: 'section', align: 'wide' }, [
    block('heading', 'core/heading', { content: 'Featured Stories', level: 2 }),
    block('paragraph', 'core/paragraph', { content: 'A short introduction.' }),
    block('image', 'core/image', { id: 1, alt: 'Mountains' }),
  ]),
  block('standalone', 'core/paragraph', { content: 'A paragraph outside the group.' }),
];

dispatch(blockEditorStore).resetBlocks(blocks);
dispatch(editorStore).setEditedPost('post', POST_ID);

const readmes = import.meta.glob('./*/README.md', { as: 'raw', eager: true });

const describe = (directory: string) => ({
  docs: {
    description: {
      story: resolveReadmeLinks(
        readmes[`./${directory}/README.md`] ?? '',
        `packages/block-editor-tools/src/hooks/${directory}`,
      ),
    },
  },
});

const Output = ({ call, value }: { call: string; value: unknown }) => (
  <>
    <p><code>{call}</code></p>
    <pre
      style={{
        background: '#f0f0f0',
        maxHeight: 400,
        overflow: 'auto',
        padding: '1em',
      }}
    >
      {value === undefined ? 'undefined' : JSON.stringify(value, null, 2)}
    </pre>
  </>
);

const BlockSelect = ({ onChange, value }: { onChange: (next: string) => void; value: string }) => (
  <SelectControl
    label="Block"
    help="The block editor is seeded with a group containing a heading, a paragraph, and an image, followed by a standalone paragraph."
    onChange={onChange}
    options={[
      { label: 'Group', value: 'group' },
      { label: '— Heading', value: 'heading' },
      { label: '— Paragraph', value: 'paragraph' },
      { label: '— Image', value: 'image' },
      { label: 'Standalone paragraph', value: 'standalone' },
    ]}
    value={value}
  />
);

const blockHookStory = (
  directory: string,
  name: string,
  useHook: (clientId: string) => unknown,
  initialClientId = 'heading',
): StoryObj => ({
  name,
  parameters: describe(directory),
  render: function Render() {
    const [clientId, setClientId] = useState(initialClientId);
    const value = useHook(clientId);

    return (
      <>
        <BlockSelect onChange={setClientId} value={clientId} />
        <Output call={`${name}('${clientId}')`} value={value} />
      </>
    );
  },
});

const idHookStory = (
  directory: string,
  name: string,
  useHook: (id: number) => unknown,
  initialId: number,
  help: string,
): StoryObj => ({
  name,
  parameters: describe(directory),
  render: function Render() {
    const [id, setId] = useState(initialId);
    const value = useHook(id);

    return (
      <>
        <TextControl
          help={help}
          label="ID"
          onChange={(next) => setId(Number(next))}
          type="number"
          value={id}
        />
        <Output call={`${name}(${id})`} value={value} />
      </>
    );
  },
});

const meta: Meta = {
  title: 'Block Editor Tools/Hooks',
  decorators: [
    (Story) => (
      <EntityProvider kind="postType" type="post" id={POST_ID}>
        <Story />
      </EntityProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component: `Hooks run against a seeded block editor, a post editor editing post ${POST_ID}, and a mocked WordPress REST API.`,
      },
    },
  },
};

export default meta;

export const UseBlockName = blockHookStory('use-block-name', 'useBlockName', useBlockName);
export const UseParentClientId = blockHookStory('use-parent-client-id', 'useParentClientId', useParentClientId);
export const UseParentBlock = blockHookStory('use-parent-block', 'useParentBlock', useParentBlock);
export const UseParentBlockAttributes = blockHookStory('use-parent-block-attributes', 'useParentBlockAttributes', useParentBlockAttributes);
export const UseInnerBlocks = blockHookStory('use-inner-blocks', 'useInnerBlocks', useInnerBlocks, 'group');
export const UseInnerBlocksAttributes = blockHookStory('use-inner-blocks-attributes', 'useInnerBlocksAttributes', useInnerBlocksAttributes, 'group');
export const UseInnerBlocksCount = blockHookStory('use-inner-blocks-count', 'useInnerBlocksCount', useInnerBlocksCount, 'group');
export const UseHasInnerBlocks = blockHookStory('use-has-inner-blocks', 'useHasInnerBlocks', useHasInnerBlocks, 'group');
export const UseInnerBlocksIndex = blockHookStory('use-inner-block-index', 'useInnerBlocksIndex', useInnerBlocksIndex, 'paragraph');

export const UseCurrentPostId: StoryObj = {
  name: 'useCurrentPostId',
  parameters: describe('use-current-post-id'),
  render: function Render() {
    return <Output call="useCurrentPostId()" value={useCurrentPostId()} />;
  },
};

export const UseCurrentTheme: StoryObj = {
  name: 'useCurrentTheme',
  parameters: describe('use-current-theme'),
  render: function Render() {
    return <Output call="useCurrentTheme()" value={useCurrentTheme()} />;
  },
};

export const UsePreviewLink: StoryObj = {
  name: 'usePreviewLink',
  parameters: describe('use-preview-link'),
  render: function Render() {
    // The preview link is derived from the current post, so make sure it is loaded.
    usePost(POST_ID);

    return <Output call="usePreviewLink()" value={usePreviewLink()} />;
  },
};

export const UsePost = idHookStory('use-post', 'usePost', usePost, POST_ID, 'Posts are 100–114.');
export const UsePostById = idHookStory('use-post-by-id', 'usePostById', usePostById, 103, 'Posts are 100–114; every fourth one is a page.');
export const UseMedia = idHookStory('use-media', 'useMedia', useMedia, 1, 'Images are 1–3, audio is 10, and video is 20.');
export const UseTerm = idHookStory('use-term', 'useTerm', useTerm, 200, 'Categories are the even IDs 200–210.');

export const UsePosts: StoryObj = {
  name: 'usePosts',
  parameters: describe('use-posts'),
  render: function Render() {
    const [ids, setIds] = useState('100,101,102');
    const postIds = ids.split(',').map(Number).filter(Boolean);
    const posts = usePosts(postIds) as { id: number; title: { rendered: string } }[] | null;

    return (
      <>
        <TextControl
          help="Comma-separated post IDs, 100–114."
          label="Post IDs"
          onChange={setIds}
          value={ids}
        />
        <Output
          call={`usePosts([${postIds.join(', ')}])`}
          value={posts?.map(({ id, title }) => ({ id, title: title.rendered })) ?? posts}
        />
      </>
    );
  },
};

export const UsePostMeta: StoryObj = {
  name: 'usePostMeta',
  parameters: describe('use-post-meta'),
  render: function Render() {
    const [postMeta, setPostMeta] = usePostMeta();

    return (
      <>
        <CheckboxControl
          checked={!!postMeta.hide_from_homepage}
          label="Hide from homepage"
          onChange={(next) => setPostMeta({ ...postMeta, hide_from_homepage: next })}
        />
        <Output call="const [meta, setMeta] = usePostMeta()" value={postMeta} />
      </>
    );
  },
};

export const UsePostMetaValue: StoryObj = {
  name: 'usePostMetaValue',
  parameters: describe('use-post-meta-value'),
  render: function Render() {
    const [subtitle, setSubtitle] = usePostMetaValue('subtitle');

    return (
      <>
        <TextControl label="Subtitle" onChange={setSubtitle} value={subtitle ?? ''} />
        <Output call="const [subtitle, setSubtitle] = usePostMetaValue('subtitle')" value={subtitle} />
      </>
    );
  },
};

export const UseTerms: StoryObj = {
  name: 'useTerms',
  parameters: describe('use-terms'),
  render: function Render() {
    const [postTerms = [], setPostTerms] = useTerms() as [
      number[] | undefined,
      (ids: number[]) => void,
    ];

    return (
      <>
        {terms.filter(({ taxonomy }) => taxonomy === 'category').map(({ id, name }) => (
          <CheckboxControl
            checked={postTerms.includes(id)}
            key={id}
            label={name}
            onChange={(checked) => setPostTerms(
              checked ? [...postTerms, id] : postTerms.filter((termId) => termId !== id),
            )}
          />
        ))}
        <Output call="const [terms, setTerms] = useTerms()" value={postTerms} />
      </>
    );
  },
};

export const UseOption: StoryObj = {
  name: 'useOption',
  parameters: describe('use-option'),
  render: function Render() {
    const {
      value,
      isEdited,
      isSaving,
      onChange,
      onSave,
    } = useOption<string>('title');

    return (
      <>
        <TextControl label="Site title" onChange={onChange} value={value ?? ''} />
        <Button disabled={!isEdited || isSaving} isBusy={isSaving} onClick={onSave} variant="primary">
          Save
        </Button>
        <Output call="useOption('title')" value={{ value, isEdited, isSaving }} />
      </>
    );
  },
};

export const UseDebounce: StoryObj = {
  name: 'useDebounce',
  parameters: describe('use-debounce'),
  render: function Render() {
    const [value, setValue] = useState('');
    const debounced = useDebounce(value, 500);

    return (
      <>
        <TextControl help="The output updates 500ms after you stop typing." label="Value" onChange={setValue} value={value} />
        <Output call="useDebounce(value, 500)" value={debounced} />
      </>
    );
  },
};

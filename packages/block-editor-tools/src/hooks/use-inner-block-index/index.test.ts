import useInnerBlockIndex from '.';

/*
 * A minimal block tree:
 *
 * - root-a
 * - parent
 *   - child-a
 *   - child-b
 */
const blocks: Record<string, { clientId: string }[]> = {
  '': [{ clientId: 'root-a' }, { clientId: 'parent' }],
  parent: [{ clientId: 'child-a' }, { clientId: 'child-b' }],
};
const parents: Record<string, string | null> = {
  'root-a': null,
  parent: null,
  'child-a': 'parent',
  'child-b': 'parent',
};

const blockEditorSelectors = {
  getBlock: (clientId: string) => ({ clientId, innerBlocks: blocks[clientId] ?? [] }),
  getBlockRootClientId: (clientId: string) => parents[clientId] ?? null,
  getBlocks: (rootClientId?: string | null) => blocks[rootClientId ?? ''] ?? [],
};

jest.mock('@wordpress/block-editor', () => ({ store: 'core/block-editor' }));
jest.mock('@wordpress/data', () => ({
  useSelect: (mapSelect: (select: () => unknown) => unknown) => mapSelect(
    () => blockEditorSelectors,
  ),
}));

// Use the real sibling hooks without loading every hook (and store) from the barrel.
jest.mock('..', () => ({
  useInnerBlocks: jest.requireActual('../use-inner-blocks').default,
  useParentClientId: jest.requireActual('../use-parent-client-id').default,
}));

test('useInnerBlockIndex should get the index of a nested block within its parent.', () => {
  expect(useInnerBlockIndex('child-a')).toEqual(0);
  expect(useInnerBlockIndex('child-b')).toEqual(1);
});

test('useInnerBlockIndex should get the index of a root-level block.', () => {
  expect(useInnerBlockIndex('root-a')).toEqual(0);
  expect(useInnerBlockIndex('parent')).toEqual(1);
});

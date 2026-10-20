import type {
  Block,
  EntityRecord,
  EntityRecordOptions,
  PostMeta,
  PostMetaSetter,
} from '../src';

describe('exported hook types', () => {
  it('lets consumers type hook values from the package entry point', () => {
    const block: Block<{ align: string }> = {
      attributes: { align: 'wide' },
      clientId: 'abc',
      innerBlocks: [],
      isValid: true,
      name: 'core/group',
    };
    const record: EntityRecord = { id: 1 };
    const options: EntityRecordOptions = { context: 'edit' };
    const meta: PostMeta = { subtitle: 'Hello' };
    const setMeta: PostMetaSetter = () => {};

    expect([block, record, options, meta, setMeta]).toHaveLength(5);
  });
});

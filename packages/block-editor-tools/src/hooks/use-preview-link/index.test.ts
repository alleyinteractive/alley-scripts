import usePreviewLink from '.';

const select = jest.fn();

jest.mock('@wordpress/data', () => ({
  useSelect: (mapSelect: (selectFn: typeof select) => unknown) => mapSelect(select),
}));

test('usePreviewLink should get the preview link from the core/editor store.', () => {
  select.mockImplementation((store: string) => (store === 'core/editor'
    ? { getEditedPostPreviewLink: () => 'https://example.org/?p=1&preview=true' }
    : {}));

  expect(usePreviewLink()).toEqual('https://example.org/?p=1&preview=true');
  expect(select).toHaveBeenCalledWith('core/editor');
});

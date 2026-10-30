/**
 * @jest-environment jsdom
 */
import { act } from 'react-dom/test-utils';
import { createRoot } from 'react-dom/client';

import CSVUploader from '.';
import { parseCSVFile } from '../../services';

jest.mock('../../services', () => ({
  parseCSVFile: jest.fn(),
}));

// Let React know that updates are wrapped in act().
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const mockParseCSVFile = parseCSVFile as jest.MockedFunction<typeof parseCSVFile>;

/**
 * Render the uploader and select a file in its input.
 */
const renderAndSelectFile = async (setAttributes = jest.fn()) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = createRoot(container);

  act(() => {
    root.render(<CSVUploader attributeName="csvData" setAttributes={setAttributes} />);
  });

  const input = container.querySelector('input[type="file"]') as HTMLInputElement;
  Object.defineProperty(input, 'files', {
    value: [new File(['title\nSample'], 'data.csv', { type: 'text/csv' })],
  });

  await act(async () => {
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  return { container, root };
};

test('CSVUploader should save parsed CSV data to the attribute.', async () => {
  mockParseCSVFile.mockResolvedValue([{ title: 'Sample' }]);
  const setAttributes = jest.fn();

  const { container, root } = await renderAndSelectFile(setAttributes);

  expect(setAttributes).toHaveBeenCalledWith({ csvData: JSON.stringify([{ title: 'Sample' }]) });
  expect(container.textContent).toContain('Successfully read CSV data.');
  act(() => root.unmount());
});

test('CSVUploader should display the message when parsing fails.', async () => {
  mockParseCSVFile.mockRejectedValue(new Error('Unable to read file.'));

  const { container, root } = await renderAndSelectFile();

  expect(container.textContent).toContain('Error:');
  expect(container.textContent).toContain('Unable to read file.');
  act(() => root.unmount());
});

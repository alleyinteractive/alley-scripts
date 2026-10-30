/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import CSVUploader from '../src/components/csv-uploader';

jest.mock('../src/services', () => ({
  parseCSVFile: jest.fn(async () => {
    throw new Error('bad csv');
  }),
}));

describe('CSVUploader', () => {
  it('shows the error message when the file cannot be parsed', async () => {
    render(<CSVUploader attributeName="csvData" setAttributes={() => {}} />);

    fireEvent.change(screen.getByLabelText('Select a file to load data.'), {
      target: { files: [new File(['a'], 'a.csv', { type: 'text/csv' })] },
    });

    expect(await screen.findByText(/bad csv/)).toBeTruthy();
  });
});

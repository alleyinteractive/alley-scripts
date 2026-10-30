/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen } from '@testing-library/react';

import Selector from '../src/components/selector';

jest.mock('../src/components/selector/styles.scss', () => ({}));

// Run the search right away instead of after the 750ms debounce.
jest.mock('@wordpress/compose', () => ({
  ...jest.requireActual('@wordpress/compose'),
  useDebounce: (fn: (value: string) => void) => fn,
}));

jest.mock('@wordpress/api-fetch', () => ({
  __esModule: true,
  default: jest.fn(async () => ({
    headers: { get: () => '1' },
    json: async () => [{ id: 1, title: 'Hello world' }],
  })),
}));

describe('Selector', () => {
  it('labels the search results list with the search input', async () => {
    render(<Selector onSelect={() => {}} />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'hello' } });

    const results = await screen.findByRole('listbox');
    const inputId = screen.getByRole('textbox').id;
    expect(inputId).toMatch(/^autocomplete-/);
    expect(results.getAttribute('aria-labelledby')).toBe(inputId);
  });
});

import toUnderscore from './toUnderscore';

describe('toUnderscore', () => {
  test('replaces hyphens with underscores', () => {
    const input = 'hello-world';
    const expectedOutput = 'hello_world';
    expect(toUnderscore(input)).toEqual(expectedOutput);
  });

  test('converts all characters to lowercase', () => {
    const input = 'HeLLo-WoRLD';
    const expectedOutput = 'hello_world';
    expect(toUnderscore(input)).toEqual(expectedOutput);
  });

  test('handles empty input', () => {
    const input = '';
    const expectedOutput = '';
    expect(toUnderscore(input)).toEqual(expectedOutput);
  });
});

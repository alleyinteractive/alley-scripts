import {
  parseExpression, parseFalsy, parseObjectExpression, parseTruthy,
} from './expressions';

/* eslint-disable no-template-curly-in-string */

describe('expressions', () => {
  test.each([true, 'true', '1', 'TRUE'])('parseTruthy(%p)', (input) => {
    expect(parseTruthy(input)).toBe(true);
    expect(parseFalsy(input)).toBe(false);
  });

  test.each([false, 'false', '0', 'FALSE'])('parseFalsy(%p)', (input) => {
    expect(parseFalsy(input)).toBe(true);
    expect(parseTruthy(input)).toBe(false);
  });

  it('should parse expression', () => {
    expect(parseExpression('Hello, {{ inputs.name }}!', {
      inputs: {
        name: 'World',
      },
    })).toBe('Hello, World!');

    // Test the usage of https://github.com/helpers/handlebars-helpers
    expect(parseExpression('{{ eq "true" "true" }}')).toBe('true');
    expect(parseExpression('{{ and "true" "1" }}')).toBe('true');
    expect(parseExpression('{{ and "true" true }}')).toBe('true');
    expect(parseExpression('{{ eq "true" "false" }}')).toBe('false');
    expect(parseExpression('{{ isFalsey "false" }}')).toBe('true');
  });

  it('should parse object expression', () => {
    expect(parseObjectExpression({
      key: 'Hello, {{ inputs.name }}!',
      sub: {
        var2: 'This is {{ inputs.var2 }}',
      },
    }, {
      inputs: {
        name: 'World',
        var2: 'a test',
      },
    })).toEqual({
      key: 'Hello, World!',
      sub: {
        var2: 'This is a test',
      },
    });
  });
});

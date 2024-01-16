/* eslint-disable import/prefer-default-export */

import getEnvironment from './environment.js';

type ExpressionContext = Record<string, any>;

/**
 * Parse an expression with the given context.
 *
 * Context is expected to be an object with keys and values. For example:
 *
 *  {
 *    "context": {
 *      "example": "value"
 *    },
 *    "inputs": {
 *      "key": "value"
 *    }
 *  }
 *
 * The above would be accessible as `context.example` and `inputs.key` in the
 * expressions.
 */
export function parseExpression(expression: string, context: ExpressionContext = {}) {
  return getEnvironment().renderString(expression, context);
}

/**
 * Parse an entire object through the expression parser.
 */
export function parseObjectExpression<TObject>(
  object: TObject extends object ? TObject : never,
  context: ExpressionContext = {},
): TObject {
  return Object.entries(object).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: typeof value === 'object'
      ? parseObjectExpression<TObject>(value, context)
      : parseExpression(`${value}`, context),
  }), {}) as TObject;
}

/**
 * Parse a string or boolean to a truthy boolean.
 */
export function parseTruthy(expression: string | boolean) {
  if (typeof expression === 'boolean') {
    return expression;
  }

  return ['true', '1'].includes(`${expression}`.toLowerCase());
}

/**
 * Parse a string or boolean to a falsy boolean.
 */
export function parseFalsy(expression: string | boolean) {
  if (typeof expression === 'boolean') {
    return !expression;
  }

  return ['false', '0'].includes(`${expression}`.toLowerCase());
}

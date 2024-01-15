/* eslint-disable import/extensions */

import {
  Parser,
  Lexer,
  Evaluator,
  data,
} from '@actions/expressions';
import { Pair } from '@actions/expressions/data/expressiondata';

type ExpressionContext = Record<string, any>;

/**
 * Return the default expression functions.
 */
const defaultExpressionFunctions = () => [];

/**
 * Convert a key/value object to a data dictionary.
 */
export function keyValueToDictionary(obj: Record<string, any>): data.Dictionary {
  const pairs = Object.entries(obj).map(([key, value]) => ({
    key,
    value: typeof value === 'object'
      ? keyValueToDictionary(value)
      : new data.StringData(`${value}`),
  } as Pair));

  return new data.Dictionary(...pairs);
}

/**
 * Parse expressions via the @actions/expressions package and return the result.
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
 *
 * @link https://github.com/actions/languageservices/tree/main/expressions
 */
export function parseExpression(
  expression: string,
  context: ExpressionContext = {},
  extensionFunctions: [] = [],
) {
  const lexer = new Lexer(expression);
  const lr = lexer.lex();

  const functions = [
    ...extensionFunctions,
    ...defaultExpressionFunctions(),
  ];

  const parser = new Parser(lr.tokens, Object.keys(context), functions);
  const evaluator = new Evaluator(parser.parse(), keyValueToDictionary(context));

  return evaluator.evaluate();
}

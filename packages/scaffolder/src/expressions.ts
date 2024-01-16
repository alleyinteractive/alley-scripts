/* eslint-disable import/prefer-default-export */

import jexl from 'jexl';
import nunjucks from 'nunjucks';

nunjucks.configure({
  autoescape: false,
  tags: {
    variableStart: '${{',
    variableEnd: '}}',
  },
  throwOnUndefined: true,
});

// import {
//   Parser,
//   Lexer,
//   Evaluator,
//   data,
// } from '@actions/expressions';
// import { Pair } from '@actions/expressions/data/expressiondata';

type ExpressionContext = Record<string, any>;
// type ExpressionFunction =

/**
 * Return the default expression functions.
 */
const defaultExpressionFunctions = () => [];

// /**
//  * Convert a key/value object to a data dictionary.
//  */
// export function keyValueToDictionary(obj: Record<string, any>): data.Dictionary {
//   const pairs = Object.entries(obj).map(([key, value]) => ({
//     key,
//     value: typeof value === 'object'
//       ? keyValueToDictionary(value)
//       : new data.StringData(`${value}`),
//   } as Pair));

//   return new data.Dictionary(...pairs);
// }

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
  console.log('parse expression', expression, context);

  // if (extensionFunctions.length) {
  //   extensionFunctions.forEach((fn) => {
  //     jexl.addFunction(fn.name, fn.fn);
  //   }

  return nunjucks.renderString(expression, context);

  // return jexl.evalSync(expression, context);

  // const lexer = new Lexer(expression);
  // const lr = lexer.lex();

  // const functions = [
  //   ...extensionFunctions,
  //   ...defaultExpressionFunctions(),
  // ];

  // const parser = new Parser(lr.tokens, Object.keys(context), functions);
  // const evaluator = new Evaluator(parser.parse(), keyValueToDictionary(context));

  // return evaluator.evaluate();
}

/**
 * Parse an entire object through the expression parser.
 */
export function parseObjectExpression<TObject>(
  object: TObject extends object ? TObject : never,
  context: ExpressionContext = {},
) {
  return Object.entries(object).reduce((acc, [key, value]) => ({
    ...acc,
    [key]: parseExpression(`${value}`, context),
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

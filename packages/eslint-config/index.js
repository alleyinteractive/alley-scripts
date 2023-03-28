/**
 * The main configuration uses React.
 * If you are not using React, use the /base config instead.
 * This package provides Airbnb's as an extensible shared config alongside a few custom rules.
 *
 * @see https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb
 */
module.exports = {
  extends: [require.resolve('./configs/react')],
  rules: {},
};

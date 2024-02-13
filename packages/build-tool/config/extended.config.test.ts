/* eslint-disable max-classes-per-file */
// Import Jest and the deep extension function
import deepExtend from 'deep-extend';

class Rectangle {
  height: number;

  width: number;

  constructor(height: number, width: number) {
    this.height = height;
    this.width = width;
  }
}

class FunSquare {
  size: number;

  constructor(size: number) {
    this.size = size;
  }
}

// Define two objects with different structures
const defaultConfig = {
  entry: () => ({
    a: 1,
    b: 2,
  }),
  output: {
    c: 2,
    d: 3,
  },
  plugins: [
    'house',
    new Rectangle(1, 2),
  ],
  resolve: {
    a: {
      b: 1,
      c: 2,
    },
  },
};

const extendedConfig = {
  entry: () => ({
    l: 3,
  }),
  output: {
    f: 5,
    d: 6,
  },
  plugins: [
    ...(Array.isArray(defaultConfig.plugins) ? defaultConfig.plugins : []),
    'cabin',
    new FunSquare(2),
  ],
  resolve: {
    a: {
      l: () => 'm',
    },
  },
};

deepExtend(defaultConfig, extendedConfig);

const result = {
  entry: () => ({
    a: 1,
    b: 2,
    l: 3,
  }),
  output: {
    c: 2,
    d: 6,
    f: 5,
  },
  plugins: [
    'house',
    new Rectangle(1, 2),
    'cabin',
    new FunSquare(2),
  ],
  resolve: {
    a: {
      b: 1,
      c: 2,
      l: () => 'm',
    },
  },
};

describe('Test merging webpack configs', () => {
  test('The default Webpack configuration should be deeply extended.', () => {
    expect(JSON.stringify(defaultConfig)).toEqual(JSON.stringify(result));
  });
});

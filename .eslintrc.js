export const root = true;
export const env = {
  node: true,
};
export const globals = {
  __static: 'readonly',
};
export const extends = [
  'eslint:recommended',
  'plugin:import/errors',
  'plugin:vue/essential',
  'plugin:jest/recommended',
  'plugin:vue/recommended',
  '@vue/airbnb',
  '@vue/typescript/recommended'
];
export const rules = {
  'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  'no-unused-vars': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', {
    argsIgnorePattern: '^_',
  }],
  'no-underscore-dangle': 'off',
  'no-warning-comments': 'warn',
  'prefer-destructuring': ['warn', {
    AssignmentExpression: {
      array: false,
    },
  }],
  'import/extensions': ['error', {
    js: 'never',
    svg: 'always',
    vue: 'ignorePackages',
  }],
  'import/order': ['error', {
    groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin'],
    'newlines-between': 'never',
  }],
  'import/prefer-default-export': 'off',
  'jest/no-test-prefixes': 'off',
};
export const parserOptions = {
  parser: 'babel-eslint',
};
export const settings = {
  'import/extensions': [
    '.js',
    '.vue',
  ],
  'import/resolver': {
    node: {},
    webpack: {
      config: require.resolve('@vue/cli-service/webpack.config.js'),
    },
  },
};

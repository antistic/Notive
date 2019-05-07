module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:vue/essential',
    'plugin:jest/recommended',
    'plugin:vue/recommended',
    '@vue/airbnb',
  ],
  rules: {
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
      vue: 'ignorePackages',
    }],
    'import/order': ['error', {
      groups: ['index', 'sibling', 'parent', 'internal', 'external', 'builtin'],
      'newlines-between': 'never',
    }],
    'jest/no-test-prefixes': 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
  settings: {
    'import/extensions': [
      '.js',
      '.vue',
    ],
    'import/resolver': {
      webpack: {
        config: require.resolve('@vue/cli-service/webpack.config.js'),
      },
    },
  },
};

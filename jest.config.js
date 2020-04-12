export const moduleFileExtensions = [
  'js',
  'jsx',
  'json',
  'vue',
];
export const transform = {
  '^.+\\.vue$': 'vue-jest',
  '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
  '^.+\\.jsx?$': 'babel-jest',
  '^.+\\.svg$': '<rootDir>/tests/svgTransform.js',
};
export const transformIgnorePatterns = [
  '/node_modules/',
  '/dist_electron/',
];
export const moduleNameMapper = {
  '^@/(.*)$': '<rootDir>/src/$1',
  '^@icons/(.*)$': '<rootDir>/src/assets/ionicons/$1',
};
export const snapshotSerializers = [
  'jest-serializer-vue',
];
export const testMatch = [
  '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
];
export const testURL = 'http://localhost/';
export const watchPlugins = [
  'jest-watch-typeahead/filename',
  'jest-watch-typeahead/testname',
];

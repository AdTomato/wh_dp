module.exports = {
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx',
  ],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: [
    'jest-serializer-vue',
  ],
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  testURL: 'http://localhost/',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/test/coverage',
  collectCoverageFrom: [
    '**/src/**',
    '**/*.{js,ts,vue}',
    '!**/src/icons/**',
    '!**/src/styles/**',
    '!**/src/directives/**',
    '!**/src/locale/**',
    '!**/src/typings/**',
    '!**/node_modules/**',
    '!**/packages/**',
    '!**/dist/**',
    '!**/src/assets/**',
    '!**/src/router/**',
    '!**/src/views/login/**',
    '!**/src/views/oauth/**'
  ],
  coverageReporters: ['html', 'text-summary'],
};

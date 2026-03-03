const path = require('path');

// Node.js 22+ may expose localStorage as a getter that throws unless started
// with `--localstorage-file`. html-webpack-plugin can touch this during template
// evaluation, so we provide a harmless in-memory shim for build-time.
const localStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
if (localStorageDescriptor?.configurable) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    enumerable: true,
    value: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    },
  });
}

module.exports = {
  webpack: {
    alias: {
      '@api': path.resolve(__dirname, './src/util/api/index.ts'),
      '@store': path.resolve(__dirname, './src/store'),
      '@config': path.resolve(__dirname, './src/config'),
      '@ui': path.resolve(__dirname, './src/design-system'),
      '@types': path.resolve(__dirname, './src/types'),
      '@icons': path.resolve(__dirname, './src/icons/index.ts'),
      '@util': path.resolve(__dirname, './src/util/index.ts'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@amplitude': path.resolve(__dirname, './src/util/amplitude/index.ts'),
    },
    configure: (config) => {
      // Optionally, handle source maps if necessary
      const fileLoaderRule = getFileLoaderRule(config.module.rules);
      if (!fileLoaderRule) {
        throw new Error('File loader not found');
      }
      fileLoaderRule.exclude.push(/\.cjs$/);

      return config;
    },
  },
};

function getFileLoaderRule(rules) {
  for (const rule of rules) {
    if ('oneOf' in rule) {
      const found = getFileLoaderRule(rule.oneOf);
      if (found) {
        return found;
      }
    } else if (rule.test === undefined && rule.type === 'asset/resource') {
      return rule;
    }
  }
}

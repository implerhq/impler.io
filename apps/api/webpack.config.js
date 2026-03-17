const path = require('path');

module.exports = (options) => ({
  ...options,
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack-cache'),
    buildDependencies: {
      config: [__filename],
    },
  },
});

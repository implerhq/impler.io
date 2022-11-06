const path = require('path');
module.exports = {
  webpack: {
    alias: {
      '@store': path.resolve(__dirname, './src/store'),
      '@client': path.resolve(__dirname, './src/client'),
      '@config': path.resolve(__dirname, './src/config'),
      '@ui': path.resolve(__dirname, './src/design-system'),
      '@types': path.resolve(__dirname, './src/types'),
      '@icons': path.resolve(__dirname, './src/icons/index.ts'),
      "@util": path.resolve(__dirname, './src/util/index.ts'),
    },
  },
};

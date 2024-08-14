const path = require('path');
module.exports = {
  webpack: {
    alias: {
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
      // Ensure ts-loader is used for .ts and .tsx files
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
        ],
        exclude: /node_modules/,
      });

      // Ensure that .ts and .tsx files are resolved
      config.resolve.extensions.push('.ts', '.tsx');

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

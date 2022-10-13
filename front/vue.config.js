const { defineConfig } = require('@vue/cli-service');
const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    resolve: {
      extensions: ['ts'],
      alias: {
        api: path.resolve(__dirname, './src/api/'),
      },
    },
    plugins: [
      new StyleLintPlugin({
        files: [path.resolve(__dirname, 'src/**/*.{vue,scss}')],
      }),
    ],
    output: {
      filename: 'all.min.js',
      chunkFilename: 'all.min.js',
    },
    optimization: {
      splitChunks: false,
    },
  },
  css: {
    extract: false,
  },
  productionSourceMap: false,
});

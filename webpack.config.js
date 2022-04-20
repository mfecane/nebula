'use strict'

var path = require('path')

var rules = [
  require('./webpack/loaders/glsl'),
  ...require('./webpack/loaders/css'),
  require('./webpack/loaders/image'),
  require('./webpack/loaders/svg'),
  require('./webpack/loaders/file'),
  require('./webpack/loaders/html'),
  {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader'],
  },
]

module.exports = {
  mode: 'development',
  entry: path.resolve(__dirname, 'src/ts/index.tsx'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    modules: ['node_modules', 'src'],
    alias: {
      shaders: path.resolve(__dirname, 'src/shaders'),
      js: path.resolve(__dirname, 'src/js'),
      ts: path.resolve(__dirname, 'src/ts'),
      css: path.resolve(__dirname, 'src/css'),
      templates: path.resolve(__dirname, 'src/templates'),
      assets: path.resolve(__dirname, 'assets'),
    },
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    hot: true,
    historyApiFallback: true,
    devMiddleware: {
      publicPath: path.resolve(__dirname, 'dist'),
      writeToDisk: true,
    },
  },
  devtool: 'source-map',
  plugins: require('./webpack/plugins'),
}

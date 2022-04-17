'use strict'

var path = require('path')
const root = path.resolve(__dirname, '..')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin')
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = [
  new CleanWebpackPlugin(),
  new HtmlWebpackPlugin({
    template: path.resolve(root, 'src/templates/index.html'),
  }),
  // new CopyPlugin({
  //   patterns: [
  //     {
  //       from: path.resolve(root, "assets/img"),
  //       to: path.resolve(root, "dist/img"),
  //     },
  //   ],
  // }),
  new MiniCssExtractPlugin(),
  new Dotenv({
    path: path.resolve(root, '.env.local'),
  }),
  // new ErrorOverlayPlugin(),
  // new ImageMinimizerPlugin({
  //   minimizerOptions: {
  //     plugins: [
  //       ["gifsicle", { interlaced: true }],
  //       ["mozjpeg", { quality: 80 }],
  //       [
  //         "pngquant",
  //         {
  //           quality: [0.6, 0.8],
  //         },
  //       ],
  //     ],
  //   },
  // }),
]

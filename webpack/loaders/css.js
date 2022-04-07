'use strict'

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
var cssnano = require('cssnano')

var rules = []

rules.push({
  test: /\.(scss|css)$/,
  exclude: /\.module\.scss$/i,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: { sourceMap: true },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            require('autoprefixer'),
            require('css-mqpacker'),
            require('cssnano')({
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                },
              ],
            }),
          ],
        },
      },
    },
    {
      loader: 'sass-loader',
      options: { sourceMap: true },
    },
  ],
})

rules.push({
  test: /\.module\.(scss|css)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 2,
        modules: {
          mode: 'local',
          localIdentName: '[local]--[hash:base64:5]',
          // localsConvention: "camelCase"
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            require('autoprefixer'),
            require('css-mqpacker'),
            require('cssnano')({
              preset: [
                'default',
                {
                  discardComments: {
                    removeAll: true,
                  },
                },
              ],
            }),
          ],
        },
      },
    },
    {
      loader: 'sass-loader',
      options: { sourceMap: true },
    },
  ],
})

module.exports = rules

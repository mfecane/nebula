"use strict";

module.exports = {
  test: /\.(svg)$/i,
  exclude: /\.inline\.svg$/,
  loader: 'url-loader'
};

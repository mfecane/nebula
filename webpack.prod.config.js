"use strict";

var path = require("path");
var cfg = require(path.resolve(__dirname, 'webpack.config.js'));

cfg = Object.assign(cfg, {
  mode: 'production'
});

module.exports = cfg;

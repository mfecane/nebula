"use strict";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  test: /\.(scss|css)$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: { sourceMap: true },
    },
    {
      loader: "postcss-loader",
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            require("autoprefixer"),
            require("css-mqpacker"),
            require("cssnano")({
              preset: [
                "default",
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
      loader: "sass-loader",
      options: { sourceMap: true },
    },
  ],
};

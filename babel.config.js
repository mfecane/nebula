
module.exports = {
  presets: [
    "@babel/preset-typescript",
    "@babel/preset-react",
  ],
  plugins: [
    [
      "@babel/plugin-proposal-class-properties",
      {
        loose: true,
      },
    ],
    ["@babel/plugin-transform-modules-commonjs"],
  ],
}

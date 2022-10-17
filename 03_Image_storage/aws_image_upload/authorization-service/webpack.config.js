const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  target: "node",
  resolve: {
    extensions: [".cjs", ".mjs", ".js", ".ts"],
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.join(__dirname, ".webpack"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        exclude: [
          [
            path.resolve(__dirname, "node_modules"),
            path.resolve(__dirname, ".webpack"),
            path.resolve(__dirname, ".serverless"),
          ],
        ],
      },
    ],
  },
};

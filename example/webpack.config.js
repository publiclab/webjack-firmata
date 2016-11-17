const webpack = require('webpack');

module.exports = {
  entry: './Demo.js',
  output: {
    filename: 'bundle.js',
    library: "Demo"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
    }),
    new webpack.IgnorePlugin(/^mock-firmata$/),
    new webpack.ContextReplacementPlugin(/bindings$/, /^$/)
  ],
  externals: ["bindings", "fs", "child_process"]
};

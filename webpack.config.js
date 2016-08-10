const webpack = require('webpack');

module.exports = {
    entry: './src/demo.js',
    output: {
        path: './example',
        filename: 'bundle.js'
    },

    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false,
        //     },
        //     output: {
        //         comments: false,
        //     },
        // }),
        new webpack.IgnorePlugin(/^mock-firmata$/),
        new webpack.ContextReplacementPlugin(/bindings$/, /^$/)
    ],
    externals: ["bindings", "fs", "child_process"]
};
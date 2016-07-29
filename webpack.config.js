const webpack = require('webpack');

module.exports = {
    entry: './src/demo.js',
    output: {
        path: './example',
        filename: 'bundle.js'
    },

    // plugins: [
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false,
    //         },
    //         output: {
    //             comments: false,
    //         },
    //     }),
    // ]
};
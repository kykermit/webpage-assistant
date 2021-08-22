/* eslint-disable no-undef */

module.exports = {
    entry: {
        common: './src/ts/common.ts'
    },
    output: {
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [{
            test: /\.ts$/,
            loader: 'ts-loader'
        }],
    }
};

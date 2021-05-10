/* eslint-disable */

'use strict';

const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: '**/node_modules',
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                use: ['handlebars-loader'],
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new BundleAnalyzerPlugin(),
        new HtmlWebpackPlugin({
            title: 'Multistep',
            template: 'src/demo.hbs',
        }),
    ],
};
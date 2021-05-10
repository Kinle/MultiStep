/* eslint-disable */
'use strict';
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { mergeWithRules } = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mainScript = './src/scripts/MultiStep';
const commonConfig = {
    entry: {
        'multistep': mainScript,
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './dist/'),
        filename: "[name].js",
        library: {
            name: 'MultiStep',
            type: 'umd',
            export: 'default',
            umdNamedDefine: true,
        }
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader],
            },
            {
                test: /\.scss$/,
                use: [
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [autoprefixer()],
                            },
                        },
                    },
                    'sass-loader',
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'ts-loader'],
            }
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
            cleanOnceBeforeBuildPatterns: [path.resolve(__dirname, "./dist")],
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    ],
    resolve: {
        extensions: ['.ts', '.js', '.scss'],
    },
}

function getConfig() {
    const nodeEnv = process.env.NODE_ENV || 'development';
    console.log(`Environment is ${nodeEnv}`);
    return require(`./webpack.${nodeEnv}.config.js`);
}

const finalConfig = mergeWithRules({
    module: {
        rules: {
            test: 'match',
            use: 'prepend',
        },
    },
})(commonConfig, getConfig());

module.exports = finalConfig;

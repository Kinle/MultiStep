/* eslint-disable */
'use strict';

const TerserPlugin = require('terser-webpack-plugin')
const mainScript = './src/scripts/MultiStep';
module.exports = {
    mode: 'production',
    entry: {
        'multistep': mainScript,
        'multistep.min': mainScript,
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            include: /\.min\.js$/
        })]
    }
};

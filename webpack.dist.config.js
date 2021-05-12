const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const {findIndex} = require('lodash');
const log = require('fancy-log');
const chalk = require('chalk');
const printError = err => log(chalk.bgRed(chalk.white(err)));

if(process.env.NODE_ENV && !['production', 'prototype'].includes(process.env.NODE_ENV)) {
  printError(`You're trying to build for '${process.env.NODE_ENV}' but building is meant for production environment`);
  printError(`Try setup your environment to 'production' or 'prototype'`);
}

const environment = require('./config')(process.env.NODE_ENV || 'production');
config.output = {
  filename: '[name].bundle.js',
  publicPath: '',
  path: path.resolve(__dirname, './dist')
};

const extractCssPropIndex = findIndex(config.module.rules, {test: /\.scss$/});
if(extractCssPropIndex !== -1) {
  config.module.rules[extractCssPropIndex] = {
    test: /\.scss/,
    use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
  };
}

config.plugins = config.plugins.concat([

  //reduce code size
  new UglifyJsPlugin({uglifyOptions: {
    mangle: true,
    mangleProps: {
        reserved: ['$super', '$', 'exports', 'require', 'angular']
    },
    ie8: false,
    keep_fnames: false,
    warnings: false,
    unused: true,
    comparisons: true,
    sequences: true,
    dead_code: true,
    evaluate: true,
    if_return: true,
    join_vars: true,
    collapse_vars: true,
    reduce_vars: false,
    output: {
      comments: false,
    },
  }}),
  new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false
  }),
  new MiniCssExtractPlugin({filename: 'app.css'}),
  new webpack.DefinePlugin({environment})
]);

config.mode = "production";

module.exports = config;

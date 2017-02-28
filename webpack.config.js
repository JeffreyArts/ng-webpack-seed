const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'sourcemap',
  entry: {},
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'sass-loader'},
        ]
      },
      {
        test: /\.js$/,
        exclude: [/app\/lib/, /node_modules/],
        use: [
          {loader: 'ng-annotate-loader'},
          {loader: 'babel-loader'},
        ]
      },
      {
        test: /\.html$/,
        use: [
          {loader: 'raw-loader'}
        ]
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {loader: 'url-loader', options: {limit: 8192}},
        ]
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {loader: 'url-loader', options: {limit: 10000, mimetype: 'application/font-woff'}},
        ]
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [
          {loader: 'file-loader'},
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: false
    }),

    //copy static assets
    new CopyWebpackPlugin([
      {
        context: 'client/fonts',
        from: '**/*',
        to: 'fonts'
      },
      {
        context: 'client/img',
        from: '**/*',
        to: 'img'
      },
      {
        context: 'node_modules/font-awesome/fonts',
        from: '**/*',
        to: 'fonts'
      },
    ]),

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    })
  ]
};

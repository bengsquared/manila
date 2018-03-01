var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'build');
var APP_DIR = path.resolve(__dirname,'src');

var config = {
  entry: './react.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
    module: {
    rules: [
         {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            query: {
               presets: ['es2015', 'react']
            }
         }
      ]
  }
};

module.exports = config;
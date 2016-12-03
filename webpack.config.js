var path = require('path');
var Webpack = require('webpack');

module.exports = {
  entry: {
    app: ['./src/script.js'],
    test: ['./jasmine/spec/inverted-index-test.js']
  },
  output: {
    path: './jasmine/spec',
    filename: '[name].js',
    library: 'invertedIndex',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {

  },
  plugins: [],
  stats: {
    // Nice colored output
    colors: true
  },
  // Create Sourcemaps for the bundle
  devtool: 'source-map'
};

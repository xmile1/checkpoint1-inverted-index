var path = require('path');
var Webpack = require('webpack');

module.exports = {
  entry: "./src/script.js",
  output: {
  library: "invertedIndex",
  libraryTarget: 'umd',
   umdNamedDefine: true
},

    module: {

    },
        plugins:[
  ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
};

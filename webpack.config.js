var path = require('path');
var Webpack = require('webpack');

module.exports = {
    
    module: {
        loaders: [
            {
                loader: 'babel-loader',
                test: /\.json$/, loader: 'json',
                query: {
                  presets: 'es2015',
                },
            }
        ]
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
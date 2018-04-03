// webpack.config.js
var webpack = require('webpack');

module.exports = {
  entry: {
    site: './source/javascripts/site.js'
  },

  plugins: [
  new webpack.ProvidePlugin({
    THREE: 'three',
  })
  ],

  resolve: {
    modules: [__dirname, 'node_modules'],
    extensions: ['*','.js','.jsx']
    // root: __dirname + '/source/javascripts',
  },

  output: {
    path: __dirname + '/.tmp/dist',
    filename: 'javascripts/[name].js',
  },

  module: {
    
    loaders: [
      {
        enforce: 'pre',
        test: /\.(scss|sass)$/i,
        loader: 'import-glob-loader'
      },
      {
        test: /source\/assets\/javascripts\/.*\.js$/,
        exclude: /node_modules|\.tmp|vendor/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0']
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'url-loader?limit=10000',
          'img-loader'
        ]
      },
      {
        test:[/\.vert$/,/\.frag$/],
        loader: 'webpack-glsl-loader'
      }
    ]
  }
};

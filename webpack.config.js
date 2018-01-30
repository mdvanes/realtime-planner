const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'bower_components')
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: [{ loader: 'ts-loader' }, { loader: 'tslint-loader' }]
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};

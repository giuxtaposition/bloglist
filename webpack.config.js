const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env, argv) => {
  const { mode } = argv

  const htmlPlugin = new HtmlWebPackPlugin({
    template: './client/public/index.html',
    filename: './index.html',
  })

  const additionalPlugins =
    mode === 'production' ? [new MiniCssExtractPlugin()] : []

  const cssLoader =
    mode === 'production'
      ? {
          test: /\.(css)$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        }
      : {
          test: /\.(css)$/,
          use: ['style-loader', 'css-loader'],
        }

  return {
    mode,
    entry: ['@babel/polyfill', './client/index.js'],

    module: {
      rules: [
        // React Loader
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: { presets: ['@babel/preset-env', '@babel/preset-react'] },
        },
        // CSS Loader
        cssLoader,
        // File Loader
        {
          test: /\.(png|svg|jpg|gif)$/,
          loader: 'file-loader',
          options: { name: '/static/[name].[ext]' },
        },
      ],
    },
    resolve: {
      extensions: ['*', '.js', '.jsx'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/',
    },
    devServer: {
      contentBase: path.resolve(__dirname, 'dist'),
      hot: true,
    },
    plugins: [...additionalPlugins, htmlPlugin],
  }
}

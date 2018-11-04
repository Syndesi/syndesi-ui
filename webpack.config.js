const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.htm',
  filename: 'index.html',
  inject: 'body'
});
const globImporter = require('node-sass-glob-importer');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const KssWebpackPlugin = require('kss-webpack-plugin');

common = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  devtool: 'eval',
  devServer: {
    inline: true,
    port: 8080
  },
  mode: process.env.NODE_ENV || 'development',
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
      {
        test: /\.(sc|c)ss/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              importer: globImporter()
            }
          }
        ]
      },
      { test: /\.(png|jpg|gif)$/, use: 'file-loader' },
      { test: /\.svg$/, use: 'url-loader?limit=16000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
      { test: /\.woff$/, use: 'url-loader?limit=16000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
      { test: /\.woff2$/, use: 'url-loader?limit=16000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
      { test: /\.[ot]tf$/, use: 'url-loader?limit=16000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
      { test: /\.eot$/, use: 'url-loader?limit=16000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' }
    ]
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    HtmlWebpackPluginConfig,
    new MiniCssExtractPlugin({
      filename: "syndesi-ui.css"
    })
  ]
}

development = {
  plugins: [
    new KssWebpackPlugin({
      source: './src',
      destination: './docs',
      css: [
        'http://localhost:8080/syndesi-ui.css'
      ],
      title: "syndesi-ui",
      builder: "./docsTheme/",
      custom: [
        "hidemarkup"
      ]
    })
  ]
};

production = {
  plugins: [
    new KssWebpackPlugin({
      source: './src',
      destination: './docs',
      css: [
        './syndesi-ui.css'
      ],
      title: "syndesi-ui",
      builder: "./docsTheme/",
      custom: [
        "hidemarkup"
      ]
    })
  ]
};


const env = process.env.NODE_ENV || 'development';
envConfig = {};
switch(env){
  case 'production':
    envConfig = production;
    break;
  case 'development':
    envConfig = development;
    break;
  default:
    break;
}
module.exports = webpackMerge(common, envConfig);
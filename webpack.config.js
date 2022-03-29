/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/*jshint esversion: 6 */

const isDevelopment = process.env.NODE_ENV === 'development';

const path = require('path');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {

  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',

  entry: {
    './dist/js/mind-gallery': './src/mind-gallery.tsx',
    './dist/js/mind-gallery-nomodule': './src/mind-gallery-nomodule.tsx',
    './dist/css/mind-gallery': './src/sss/mind-gallery.css'
  },

  plugins: [new MiniCssExtractPlugin()],

  externals: {
    'react': 'window.React',
    'react-dom': 'window.ReactDOM',
    //'gsap': 'window.gsap'
  },

  module: {
    rules: [

      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'source-map-loader'
        },
        {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ]
          }
        }
        ],
        enforce: 'pre'
      },

      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },

      {
        test: /\.css$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader
        }, 'css-loader', 'postcss-loader'],
      },
    ]
  },


  optimization: {
    minimize: true,
    minimizer: [
      //new TerserJSPlugin({}),
      `...`,
      new CssMinimizerPlugin(),
    ],
  },

  resolve: {
    extensions: ['.js', 'jsx', '.tsx', '.ts'],
  },

  output: {
    path: path.resolve(__dirname),
    filename: '[name].js',
  },
};
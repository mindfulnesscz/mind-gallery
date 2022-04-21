/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
/*jshint esversion: 6 */

const isDevelopment = process.env.NODE_ENV === 'development';

const path = require( 'path' );

//const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CssMinimizerPlugin = require( 'css-minimizer-webpack-plugin' );

module.exports = {

  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'inline-source-map' : 'source-map',

  entry: {
    'js/mind-gallery': './src/mind-gallery.tsx',
    'js/mind-gallery-nomodule': './src/mind-gallery-nomodule.tsx',
    'css/mind-gallery': './src/css/mind-gallery.css'
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
      '...',
      new CssMinimizerPlugin(),
    ],
    /*splitChunks: {
      chunks: 'all',
      minSize: 0,
      maxInitialRequests: 20,
      maxAsyncRequests: 20,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name ( module, chunks, cacheGroupKey ) {
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            return `${cacheGroupKey}.${packageName.replace( '@', '' )}`;
          }
        },
        common: {
          minChunks: 2,
          priority: -10
        }
      }
    },
    runtimeChunk: 'single'*/
  },

  resolve: {
    extensions: ['.js', 'jsx', '.tsx', '.ts'],
  },

  output: {
    path: path.resolve( __dirname, 'dist' ),
    publicPath: '/',
    filename: '[name].js',
  },
};
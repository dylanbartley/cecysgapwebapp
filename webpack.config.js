const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

function postCss () {
  return {
    loader: 'postcss-loader', // Run post css actions
    options: {
      plugins: function () { // post css plugins, can be exported to postcss.config.js
        return [
          require('precss'),
          require('autoprefixer')
        ];
      }
    }
  };
}

module.exports = env => {
  return {
    entry: {
      main: './src/main.js'
    },
    output: {
      path: path.resolve(__dirname, '../cecysgapbackend/public'),
      filename: (cData) => {
        // add hash to file only for main only in production
        return cData.chunk.name === 'main' ? (env ? '[name].[hash].js' : '[name].js') : '[name].js';
      }
    },
    optimization: {
      minimizer: [new OptimizeCSSAssetsPlugin({})],
    },
    module: {
      rules: [
        { test: /\.css/, use: [ MiniCssExtractPlugin.loader, 'css-loader', postCss() ] },
        { test: /\.html/, include: path.join(__dirname, 'src/partials'), use: 'html-loader' },
        {
          test: /\.(scss)$/,
          use: [ 
            MiniCssExtractPlugin.loader,
            'css-loader', 
            postCss(), 
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: env ? '[name].[hash].css' : '[name].css'
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ]
  };
};
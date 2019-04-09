const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require("mini-css-extract-plugin");

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
      path: path.resolve(__dirname, 'dist'),
      filename: (cData) => {
        // add hash to file only for main only in production
        return cData.chunk.name === 'main' ? (env ? '[name].[hash].js' : '[name].js') : '[name].js';
      }
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
      new MiniCssExtractPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ]
  }
};
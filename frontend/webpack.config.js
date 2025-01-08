const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = ({ mode } = { mode: "production" }) => {
  return {
    mode,
    entry: "./src/index.tsx",
    resolve: {
      extensions: ['.ts', '.tsx', '.js']
    },    
    output: {
      publicPath: "/",
      path: path.resolve(__dirname, "build"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|svg|gif|ico|png|)$/,
          exclude: /favicon\.ico$/,
          use: ['file-loader?name=[name].[ext]']
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(tsx|ts)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        favicon: false
      }),
    ],
    devServer:{
      headers:{
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
      },
      historyApiFallback: true,
      port: 3000,
      static: {
        directory: path.resolve(__dirname, 'build')
      }
    }
  }
};
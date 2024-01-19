const path = require("path");
const HtmlWPP = require("html-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource',
      }
    ]
  },
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    assetModuleFilename: 'images/[hash][ext][query]' // This line ensures assets are outputted in an 'images' folder
  },
  devServer: {
    port: 4000
  },
  plugins: [
    new HtmlWPP({
      template: path.resolve(__dirname, "public", "index.html")
    })
  ]
}
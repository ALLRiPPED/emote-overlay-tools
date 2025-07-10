const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    assetModuleFilename: 'assets/[hash][ext][query]', // optional: customize output dir
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|webm|mp4|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: 'warning', 
    maxAssetSize: 4500000, // 4.5 MB
    maxEntrypointSize: 4500000, // 4.5 MB
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: path.resolve(__dirname, 'src/index.html'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'src/config.html'), to: path.resolve(__dirname, 'dist') },
        { from: path.resolve(__dirname, 'src/css'), to: path.resolve(__dirname, 'dist/css') },
        { from: path.resolve(__dirname, 'src/lib'), to: path.resolve(__dirname, 'dist/lib') },
      ],
    }),
  ],
};

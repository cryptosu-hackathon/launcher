const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const common = {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  }
};

const serverConfig = {
  target: 'electron-main',
  mode: "production",
  entry: './src/main.ts',
  output: {
    filename: 'main.js',
  },
};

const preloadConfig = {
  target: 'electron-renderer',
  entry: './src/front/preload.ts',
  output: {
    filename: 'preload.js',
  },
};

const frontConfig = {
  target: 'electron-renderer',
  entry: {
    index: './src/front/index.ts'
  },
  output: {
    filename: 'index.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/front/index.html',
      chunks: ['index']
    })
  ],
};

module.exports = [
  Object.assign({}, common, serverConfig),
  Object.assign({}, common, preloadConfig),
  Object.assign({}, common, frontConfig),
];
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const common = {
  mode: "development",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          'loader': 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        use: [
            'vue-style-loader',
            'css-loader'
        ]
      }
    ],
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    },
    extensions: ['.tsx', '.ts', '.js', '.json', '.vue'],
  },
  devServer: {
    compress: false,
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
    }),
    new VueLoaderPlugin()
  ],
};

module.exports = [
  Object.assign({}, common, serverConfig),
  Object.assign({}, common, preloadConfig),
  Object.assign({}, common, frontConfig),
];
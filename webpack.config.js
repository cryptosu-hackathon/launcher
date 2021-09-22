const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const common = {
	mode: "development",
	devtool: "eval-cheap-module-source-map",
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
				loader: 'vue-loader',
				include: [
					path.resolve(__dirname, "src/front/")
				],
			},
			{
				test: /\.css$/,
				use: [
					'vue-style-loader',
					'css-loader'
				],
				include: [
					path.resolve(__dirname, "src/front/")
				],
			},
		],
	},
	resolve: {
		alias: {
			'vue': 'vue/dist/vue.esm-bundler.js',
			'@walletconnect/client': '@walletconnect/client/dist/cjs/index.js'
		},
		extensions: ['.tsx', '.ts', '.js', '.json', '.vue', '.node'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	}
};

const serverConfig = {
	target: 'electron-main',
	entry: './src/main.ts',
	output: {
		filename: 'main.js',
	},
	externalsPresets: {
		node: true,
	},
};

const preloadConfig = {
	target: 'electron-renderer',
	entry: './src/front/preload.ts',
	output: {
		filename: 'preload.js',
	},
	externalsPresets: {
		node: true,
	},
};

const frontConfig = {
	target: 'web',
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

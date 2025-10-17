const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const app = {
    name: 'app',
    entry: path.resolve(__dirname, 'workspaces/app/src/index.ts'),
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
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'workspaces/app/src/index.html'),
            filename: 'index.html',
            inject: 'body',
        }),
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist'),
        },
        port: 8080,
        open: false,
        hot: true,
        liveReload: true,
        watchFiles: [
            'workspaces/processors/src/**/*',
            'workspaces/app/src/**/*',
            'workspaces/app/index.html'
        ]
    },
    devtool: 'source-map',
    mode: 'development',
    target: 'web'
}

const processors = {
    name: 'processors',
    entry: {
        tone: path.resolve(__dirname, 'workspaces/processors/src/tone-processor.ts'),
        chorus: path.resolve(__dirname, 'workspaces/processors/src/chorus-processor.ts'),
        'hyperbolic-tangent': path.resolve(__dirname, 'workspaces/processors/src/hyperbolic-tangent-processor.ts'),
    },
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
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name]-processor.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        module: true
    },
    experiments: {
        outputModule: true,
    },
    devtool: 'source-map',
    mode: 'development',
    target: 'webworker'
}

module.exports = [
    app,
    processors
];
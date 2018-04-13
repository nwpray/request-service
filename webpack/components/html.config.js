const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const Config = require('webpack-config');

module.exports = new Config.default()
    .merge({
        plugins:[
            new HtmlWebpackPlugin({
                title: 'Glimmered Creations',
                template: path.resolve('./src/index.html')
            })
        ]
    });
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const Config = require('webpack-config');

module.exports = new Config.default()
    .merge({
        module:{
            rules:[
                {
                    test: /\.s?css$/,
                    use: ExtractTextPlugin.extract('css-loader!sass-loader')
                }
            ]
        },
        plugins:[
            new ExtractTextPlugin('[name].css')
        ]
    });
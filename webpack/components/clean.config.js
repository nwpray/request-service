const path = require('path');
const Config = require('webpack-config');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = new Config.default()
    .merge({
        plugins: [
            new CleanWebpackPlugin(['dist'], {
                root: path.resolve('./')
            })
        ]
    });


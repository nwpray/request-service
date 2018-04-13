const Config = require('webpack-config');

module.exports = new Config.default()
    .merge({
        module:{
            rules:[
                {
                    test: /\.jsx?$/,
                    use: ['babel-loader']
                }
            ]
        }
    });
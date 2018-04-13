const Config = require('webpack-config');

module.exports = new Config.default()
    .merge({
        module:{
            rules:[
                {
                    test: /\.tsx?$/,
                    use: ['babel-loader', 'ts-loader']
                }
            ]
        }
    });
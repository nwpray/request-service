const path = require('path');
const Config = require('webpack-config');

module.exports = new Config.default().merge({
    output:{
        path: path.resolve('dist'),
        filename: '[name].js',
        library: 'RequestService',
        libraryTarget: "umd",
        umdNamedDefine: true
    }
});
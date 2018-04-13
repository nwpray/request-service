const path = require('path');
const Config = require('webpack-config');

module.exports = new Config.default().merge({
    resolve:{
        modules: [
            path.resolve('node_modules')
        ],
        extensions:[' ', '.js', '.jsx', '.ts', '.tsx', '.css', '.scss']
    }
});
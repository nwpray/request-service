const Config = require('webpack-config');

module.exports = new Config.default()
    .merge({
        target: 'node'
    });
const path = require('path');
const Config = require('webpack-config');

module.exports = new Config.default().merge({
    entry:{
        RequestService: path.resolve('./src/index.ts')
    }
});
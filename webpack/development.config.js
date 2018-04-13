const Config = require('webpack-config');
const path = require('path');

module.exports = new Config.default()
    .extend(
        path.resolve(__dirname, 'components/default.config'),
        path.resolve(__dirname, 'components/entry.config'),
        path.resolve(__dirname, 'components/output.config'),
        path.resolve(__dirname, 'components/resolve.config'),
        path.resolve(__dirname, 'components/ts.config'),
        path.resolve(__dirname, 'components/clean.config')
    );
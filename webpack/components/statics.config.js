const path = require('path');
const Config = require('webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = new Config.default().merge({
    plugins: [
        new CopyWebpackPlugin([
            {
                from: path.resolve('./statics'),
                to: path.resolve('./myhealth')
            },
            {
                from: path.resolve('./environment/' + Config.environment.get('env')()),
                to: path.resolve('./myhealth')
            }
        ])
    ]
});

const Config = require('webpack-config');
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = new Config.default()
    .merge({
        plugins: [
            new CompressionPlugin({
                asset: "[path].gz[query]",
                algorithm: "gzip",
                test: /\.(js|html)$/,
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    });


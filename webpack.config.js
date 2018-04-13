const Config = require('webpack-config');
const environment = Config.environment;

environment.setAll({
    env: function(){ return process.env.NODE_ENV; }
});

module.exports = new Config.default()
    .extend('webpack/[env].config.js');
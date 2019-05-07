// eslint-disable-next-line import/no-extraneous-dependencies
const path = require('path');

module.exports = {
  configureWebpack: {
    externals: {
      sqlite3: 'commonjs sqlite3',
      sharp: 'commonjs sharp',
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'));
  },
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: 'file://./',
    },
  },
};

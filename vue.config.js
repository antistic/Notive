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
    const svgRule = config.module.rule('svg');

    svgRule.uses.clear();

    svgRule
      .oneOf('external')
      .resourceQuery(/external/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]',
      })
      .end()
      .end()
      .oneOf('inline')
      .use('vue-svg-loader')
      .loader('vue-svg-loader');

    config.resolve.alias
      .set('@', path.resolve(__dirname, 'src'))
      .set('@icons', path.resolve(__dirname, 'src/assets/ionicons'));
  },
  pluginOptions: {
    electronBuilder: {
      customFileProtocol: 'file://./',
    },
  },
};

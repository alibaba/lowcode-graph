const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
// const BundleBuddyWebpackPlugin = require("bundle-buddy-webpack-plugin");
const webpack = require('webpack');
const Config = require('webpack-chain');
const packageInfo = require('./package.json');

module.exports = ({ context, onGetWebpackConfig }) => {
  onGetWebpackConfig((config) => {
    config.resolve.extensions.add('.less').end();
    config.plugin('DefinePlugin').use(new webpack.DefinePlugin({
      VERSION: JSON.stringify(packageInfo.version)
    }));
    config.resolve
    .plugin('tsconfigpaths')
    .use(TsconfigPathsPlugin, [{
      configFile: './tsconfig.json',
    }]);
    // config.plugin('webpack-bundle-analyzer').use(BundleAnalyzerPlugin);
    // config.devtool('source-map');
    // config.plugin('BundleBuddyWebpackPlugin').use(new BundleBuddyWebpackPlugin());
    // if (context.command === 'start') {
    //   config.devtool('inline-source-map');
    // }
  });
};

const mergeBase = require("./webpack.config.base");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = mergeBase({
  mode: "production",
  plugins: [new BundleAnalyzerPlugin()],
});

const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssPlugin = require("optimize-css-assets-webpack-plugin");
const path = require("path");

const baseWebpackConfig = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"), //必须是绝对路径
    filename: "bundle.[hash:8].js",
    publicPath: "/", //通常是CDN地址
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              [
                "@babel/plugin-transform-runtime",
                {
                  corejs: 3,
                },
              ],
            ],
            cacheDirectory: true, // Webpack 构建，将会尝试读取缓存，来避免在每次执行时，可能产生的、高性能消耗的 Babel 重新编译过程
          },
        },
        include: [path.resolve(__dirname, "src")],
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/,
        // loader 的执行顺序是从后向前执行的
        use: [
          // "style-loader", // style-loader 动态创建 style 标签，将 css 插入到 head 中
          MiniCssExtractPlugin.loader, // 抽离css，将CSS文件单独打包
          "css-loader", // css-loader 负责处理 @import 等语句
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: ["autoprefixer"], // 自动生成浏览器兼容性前缀
              },
            },
          },
          "less-loader", // less-loader 负责处理编译 .less 文件,将其转为 css
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg|eot|ttf|woff|woff2)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, // 大于10K保留原图，小于10K转base64
              esModule: false,
              fallback: "file-loader",
              outputPath: "assets", // 指定构建目录
              name: "[name]_[hash:6].[ext]", // img_f0f46d.jpeg
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /.html$/,
        use: "html-withimg-loader",
      },
    ],
    noParse: /jquery|lodash/, // 不进行转化和解析
  },
  plugins: [
    //数组 放着所有的webpack插件
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html", //打包后的文件名
      minify: {
        removeAttributeQuotes: false, //是否删除属性的双引号
        collapseWhitespace: false, //是否折叠空白
      },
      // hash: true //是否加上hash，默认是 false
    }),
    new CleanWebpackPlugin(),
    // new CopyWebpackPlugin([
    //   {
    //     from: "public/js/*.js",
    //     to: path.resolve(__dirname, "dist", "js"),
    //     flatten: true,
    //   },
    // ]),
    new webpack.ProvidePlugin({
      React: "react",
      Component: ["react", "Component"],
      Vue: ["vue/dist/vue.esm.js", "default"],
      $: "jquery",
      _map: ["lodash", "map"],
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new OptimizeCssPlugin(), // css压缩
    new webpack.HotModuleReplacementPlugin(), // 热更新插件
    new webpack.DefinePlugin({
      // 定义环境变量
      DEV: JSON.stringify("dev"), //字符串
      FLAG: "true", //FLAG 是个布尔类型
    }),
    //忽略 moment 下的 ./locale 目录
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        pathRewrite: {
          "/api": "",
        },
      },
    },
    static: path.join(__dirname, "public"), // boolean | string | array | object, static file location
    compress: true, // enable gzip compression
    historyApiFallback: true, // true for index.html upon 404, object for multiple paths
    hot: true, // hot module replacement. Depends on HotModuleReplacementPlugin
    https: false, // true for self-signed, object for cert authority
    client: {
      logging: "error", // webpack 在浏览器的log level
      overlay: true, // 当编译出错时，会在浏览器窗口全屏输出错误
      progress: true,
    },
  },
  devtool: "cheap-module-source-map",
  resolve: {
    modules: ["./src/components", "node_modules"], // 从左到右依次查找，可以通过 import Dialog from 'dialog' 从 /src/components 引入
    alias: {
      "@src": path.resolve(__dirname, "src"),
    },
    extensions: [".js"], // 在缺省文件后缀时，告诉 webpack 优先访问哪个后缀文件，记住将频率最高的后缀放在第一位，并且控制列表的长度，以减少尝试次数
    // enforceExtension: true, // 导入语句不能缺省文件后缀
  },
};

module.exports = function mergeBase(config) {
  return merge(baseWebpackConfig, config);
};

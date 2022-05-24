const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const path = require("path");

module.exports = {
  mode: "development",
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
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.(le|c)ss$/,
        // loader 的执行顺序是从后向前执行的
        use: [
          "style-loader", // style-loader 动态创建 style 标签，将 css 插入到 head 中
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
  ],
  devServer: {
    proxy: {
      // proxy URLs to backend development server
      "/api": "http://localhost:3000",
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
};

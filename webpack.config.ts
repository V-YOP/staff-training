import path from 'path'
import { Configuration, ProgressPlugin } from 'webpack'
import 'webpack-dev-server';
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from  "mini-css-extract-plugin"

// Configuration是Webpack的配置项类型
const conf: Configuration = {
  mode: 'development', // 默认为production模式
  entry: './src/index.tsx', // 入口js文件，可以配置多个entry
  devtool: 'inline-source-map',
  watch: true,
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出路径
    filename: '[name].[chunkhash].js', // 输出文件名，具有一定动态性，如可配置成 [name].[chunkhash].js，其会被替换为名称和一个文件哈希值（以保证浏览器会重新加载，但这需要相关plugin去支持，后面再详述）
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'index.html'), // 指定 html “模板”文件
    }),
    new ProgressPlugin(), // 展示进度
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  resolve: {
    extensions: [".wasm", ".ts", ".tsx", ".mjs", ".cjs", ".js", ".json" , "css"], // webpack 将识别这些后缀文件为 module

    alias: {
      '@': path.join(__dirname, '/src/') // 配置@为src目录，使不需要每次都使用相对路径去import
    }
  },
  module: { // 关于module的配置
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif)$/, // 图片文件按 url
        type: 'asset/resource'
      }
    ]
  },
  devServer: {
    open: true,
    static: 'dist/'
  },
}

export default conf
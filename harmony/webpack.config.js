const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',  // 添加这行来指定模式
  entry: './src/index.tsx',  // 确保你的入口点是.tsx文件
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    plugins: [new TsconfigPathsPlugin({ configFile: "./tsconfig.json" })],
    modules: ['node_modules', path.resolve(__dirname, 'src')],
  },
 
  resolveLoader: {
    modules: ['node_modules', path.resolve(__dirname, 'src')],
  },
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,  // 这个正则表达式匹配.ts和.tsx文件
        use: 'ts-loader',  // 使用ts-loader处理这些文件
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          'resolve-url-loader',
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  
};


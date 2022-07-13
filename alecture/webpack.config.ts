import path from 'path';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import webpack, { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
  devServer?: WebpackDevServerConfiguration;
}

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';

const isDevelopment = process.env.NODE_ENV !== 'production';

const config: Configuration = {
  name: 'sleact',
  mode: isDevelopment ? 'development' : 'production',
  devtool: isDevelopment ? 'hidden-source-map' : 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    // TypeScript는 tsconfig.json
    // javascript 변환은 webpack.config.ts
    // 그래서 중복 설정이 있을 수 있음
    alias: {
      '@hooks': path.resolve(__dirname, 'hooks'),
      '@components': path.resolve(__dirname, 'components'),
      '@layouts': path.resolve(__dirname, 'layouts'),
      '@pages': path.resolve(__dirname, 'pages'),
      '@utils': path.resolve(__dirname, 'utils'),
      '@typings': path.resolve(__dirname, 'typings'),
    },
  },
  entry: {
    app: './client',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // tsx 파일을
        loader: 'babel-loader', // babel-loader가 바꿔줌
        options: {
          // babel-loader에 대한 설정
          presets: [
            [
              '@babel/preset-env',
              // javascript가 바꿀 때 targets에 적어준 브라우저를
              // 지원하게 하겠다
              {
                targets: { browsers: ['last 2 chrome versions' ,'IE 10'] },
                debug: isDevelopment,
              },
            ],
            // react 코드 바꿔주는 거
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          env: {
            development: {
              plugins: [['@emotion', { sourceMap: true }], require.resolve('react-refresh/babel')],
            },
            production: {
              plugins: ['@emotion'],
            }
          },
        },
        exclude: path.join(__dirname, 'node_modules'),
      },
      {
        // css파일을 javaScript로 바꿔주는걸
        // style-loadr랑 css-loader가 해줌
        test: /\.css?$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
  // TypeScript 할 때 설치 (ts랑 webpack동시에 돌아가게 해줌)
    new ForkTsCheckerWebpackPlugin({
      async: false,
      // eslint: {
      //   files: "./src/**/*",
      // },
    }),
    // react에서 NODE_ENV 변수에 접근할 수 있게 해줌 (원래는 백앤드에서 사용)
    // node runtime에서 사용되는 거라고 보면 됨!
    new webpack.EnvironmentPlugin({ NODE_ENV: isDevelopment ? 'development' : 'production' }),
  ],
  // entry(./client)에서 시작해서 뚝딱뚝딱 만든 module이
  // output 경로에 들어감 (dist라는 폴더 생성 후 안에다가)
  // filename의 대괄호는 entry폴더 아래에 있는 이름으로 (ex: app)
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/',
  },
  devServer: {
    historyApiFallback: true, // react router 설정 (새로고침 유지)
    port: 3090,
    devMiddleware: { publicPath: '/dist/' },
    static: { directory: path.resolve(__dirname) },
    // proxy: {
    //   '/api/': {
    //     target: 'http://localhost:3095',
    //     changeOrigin: true,
    //   },
    // },
  },
};

if (isDevelopment && config.plugins) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new ReactRefreshWebpackPlugin(
    // { 
    //   overlay: {
    //    useURLPolyfill: true
    //   }
    // }
  ));
}
if (!isDevelopment && config.plugins) {
}

export default config;

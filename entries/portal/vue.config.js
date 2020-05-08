const path = require('path');
const fs = require('fs');
const mockDir = path.resolve(__dirname, './mock');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultCssVars = require('@cloudpivot/common/styles/variable').pc;

const extendLessVars = require('./extends/theme');

const modifyVars = Object.assign({}, defaultCssVars, extendLessVars);

// 显示打包进度和时间
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
// 分包dll
const webpack = require('webpack');
const dllPath = "./public/vendor/";
const { library } = require("./dll.config.js");

// 多线程打包
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });
// 文件压缩
// const CompressionPlugin = require("compression-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 引入生成的 dll 文件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')


let pages = {
  main: {
    entry: 'src/main.ts',
    template: 'public/index.html',
    filename: 'index.html'
    // chunks: ["runtime", "chunk-libs", "chunk-moment", "main"]
    // chunks: ["chunk-formRender", "chunk-moment", "chunk-rxjs","chunk-libs","chunk-commons","runtime","main"]
  },
  externalLinkOld: {
    entry: 'src/views/externalLink/externalLink-old/main.ts',
    template: 'src/views/externalLink/externalLink-old/externalLink.html',
    filename: 'externalLink.html'
    // chunks: ["runtime", "chunk-libs", "chunk-moment", "externalLinkOld"]
    // chunks: ["chunk-formRender", "chunk-moment", "chunk-rxjs","chunk-libs","chunk-commons","runtime","externalLinkOld"]
  },
  externalLink: {
    entry: 'src/views/externalLink/externalLink/main.ts',
    template: 'src/views/externalLink/externalLink/el.html',
    filename: 'el.html'
    // chunks: ["runtime", "chunk-libs", "chunk-moment", "externalLink"]
    // chunks: ["chunk-formRender", "chunk-moment", "chunk-rxjs","chunk-libs","chunk-commons","runtime","externalLink"]
  }
};

module.exports = {
  pages,
  filenameHashing: true,
  productionSourceMap: true,
  // 处理IE兼容————vuex持久化脚本语法转译
  transpileDependencies: ['vuex-persist', 'flatted', /@cloudpivot\/[\w-]+/],
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.devtool = 'source-map';
    } else {
      config.devtool = 'cheap-eval-source-map';
    }
    return {
      plugins: [
        ...Object.keys(library).map(name => {
          return new webpack.DllReferencePlugin({
            context: process.cwd(),
            manifest: path.join(dllPath, `${name}-manifest.json`),
            sourceType: "global",
            scope: "dll",
            name:name,
            extensions: [".js"]
          })
        }),
        new AddAssetHtmlPlugin(Object.keys(library).map(name => {
          return {
            filepath: require.resolve(path.resolve(`${dllPath}${name}.dll.js`)),
            includeSourcemap: true,
            // dll 引用路径
            publicPath: '/vendor',
            // dll最终输出的目录
            outputPath: '/vendor'
          }
        })),
        new SimpleProgressWebpackPlugin(),
        new HappyPack({
          // id标识 需要处理的loader
          id: 'babel',
          // loader配置和原始配置一样
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es5'],
                cacheDirectory: true
              }
            }
          ],
          threadPool: happyThreadPool
        }),
        new CopyWebpackPlugin([
          {
              from: path.resolve(__dirname, '../../modules/@cloudpivot/form/src/renderer/components/pc/input-textarea/tinymcelib'),
              to: 'tinymcelib',
              ignore: ['.*']
          }
        ])
      ]
    }
    // config.devtool = process.env.NODE_ENV === 'production' ? 'eval' : 'eval-source-map';
    // if (process.env.NODE_ENV === 'production') {
    //   return {
    //     plugins: [
    //       new BundleAnalyzerPlugin(),
    //     ],
    //   };
    // }
  },
  devServer: {
    port: 9100,
    open: true,
    proxy: {
      '/api/': {
        target: process.env.VUE_APP_API + '/',
        changeOrigin: true,
      },
      '/externalLink/': {
        target: process.env.VUE_APP_API + '/',
        changeOrigin: true,
      },
      '/apis/': {
        target: process.env.VUE_APP_OAUTH_HOST + '/',
        changeOrigin: true,
        pathRewrite: {
          '^/apis': ''
        },
      },
      '/v1/': {
        target: process.env.VUE_APP_PORTAL_HOST + '/',
        changeOrigin: true,
      }
    },
    before: (app) => {
      (function setMock(mockDir) {
        fs.readdirSync(mockDir).forEach(function (file) {
          let filePath = path.resolve(mockDir, file);
          let mocks;
          if (fs.statSync(filePath).isDirectory()) {
            setMock(filePath)
          } else {
            mocks = require(filePath);
            mocks.forEach((mock) => {
              app.use(mock.api, mock.response);
            });

          }
        })
      })(mockDir)
      /**
       * 支持跨域访问
       */
      app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        res.header('X-Powered-By', '3.2.1');
        if (req.method == 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      });
    },
    disableHostCheck: true
  },
  css: {
    loaderOptions: {
      less: {
        modifyVars: modifyVars,
        javascriptEnabled: true
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('assets', path.resolve(__dirname, './src/assets'))
      .set('styles', path.resolve(__dirname, './src/styles'))
      .set('components', path.resolve(__dirname, './src/components'));

    // 移除 prefetch 插件
    ['externalLinkOld', 'main', 'externalLink']
      .map(name => config.plugins.delete(`prefetch-${name}`))


    // 优化打包，拆分app.js
    // config.optimization
    //   .splitChunks({
    //     maxInitialRequests: 10,
    //     cacheGroups: {
    //       default: false,
    //       antdVue: {
    //         name: "chunk-antdVue-UI",
    //         priority: 19, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
    //         test: /[\\/]node_modules[\\/]h3-antd-vue[\\/]/,
    //         reuseExistingChunk: true,
    //         enforce: true
    //       },
    //       formRender: {
    //         name: "chunk-formRender",
    //         minChunks: 10,
    //         priority: 19, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
    //         test: /[\\/]node_modules[\\/]h3-form-renderer-vue[\\/]/,
    //         reuseExistingChunk: true
    //       },
    //       moment: {
    //         name: "chunk-moment",
    //         priority: 12,
    //         test: /[\\/]node_modules[\\/]moment[\\/]/,
    //         reuseExistingChunk: true
    //       },
    //       rxjs: {
    //         name: "chunk-rxjs",
    //         priority: 11,
    //         test: /[\\/]node_modules[\\/]rxjs[\\/]/,
    //         reuseExistingChunk: true
    //       },
    //       libs: {
    //         name: 'chunk-libs',
    //         test: /[\\/]node_modules[\\/]/,
    //         priority: 10,
    //         chunks: 'initial', // 只打包初始时依赖的第三方
    //         reuseExistingChunk: true
    //       },
    //       commons: {
    //         name: 'chunk-commons',
    //         // test: resolve('packages'), // 可自定义拓展你的规则
    //         minChunks: 3, // 最小公用次数
    //         priority: 5,
    //         chunks: 'async',
    //         reuseExistingChunk: true
    //       }
    //     }
    //   })
    //   .runtimeChunk({
    //     name: "runtime"
    //   });

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 1024 }))
  }
};

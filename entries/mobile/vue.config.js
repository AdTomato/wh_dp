const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const defaultCssVars = require('@cloudpivot/common/styles/variable').mobile;

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
const CompressionPlugin = require("compression-webpack-plugin");

// 引入生成的 dll 文件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')

let pages = {
  main: {
    entry: 'src/main.ts',
    template: 'public/index.html',
    filename: 'index.html',
    // chunks: ["chunk-chunk-antdUI", "chunk-antdVue-UI", "chunk-form-renderer", "chunk-moment", "chunk-rxjs", "chunk-libs", "chunk-commons", "runtime", "main", "index"]

  },
  externalLink: {
    entry: 'src/views/externalLink/apps.ts',
    template: 'src/views/externalLink/el.html',
    filename: 'el.html',
    // chunks: ["chunk-chunk-antdUI", "chunk-antdVue-UI", "chunk-form-renderer", "chunk-moment", "chunk-rxjs", "chunk-libs", "chunk-commons", "runtime", "externalLink", "el"]
  }
};

module.exports = {
  publicPath: '/mobile/',
  pages,
  filenameHashing: true,
  productionSourceMap: true,
  // 处理IE兼容————vuex持久化脚本语法转译
  transpileDependencies: ['vuex-persist', 'flatted', /@cloudpivot\/[\w-]+/],
  configureWebpack: config => {
    // 分包dll
    let pluginsPro = [
      ...Object.keys(library).map(name => {
        return new webpack.DllReferencePlugin({
          context: __dirname,
          manifest: path.join(dllPath, `${name}-manifest.json`),
          sourceType: "global",
          scope: "dll",
          name: name,
          extensions: [".js"]
        })
      })
    ];
    config.plugins = config.plugins.concat(pluginsPro)

    if (process.env.NODE_ENV === 'production') {
      config.devtool = 'source-map';
    } else {
      config.devtool = 'cheap-eval-source-map';
    }

    return {
      plugins: [
        new SimpleProgressWebpackPlugin(),
        new HappyPack({
          // id标识 需要处理的loader
          id: 'babel',
          // loader配置和原始配置一样
          loaders: [
            {
              loader: 'babel-loader',
              options: {
                presets: ['es2015'],
                cacheDirectory: true
              }
            }
          ],
          threadPool: happyThreadPool
        }),
        // 将 dll 注入到 生成的 html 模板中
        new AddAssetHtmlPlugin({
          // dll文件位置
          filepath: path.resolve(dllPath + '*.js'),
          // dll 引用路径
          publicPath: '/mobile/vendor',
          // dll最终输出的目录
          outputPath: '/mobile/vendor'
        })
      ]
    }

  },
  devServer: {
    port: 8089,
    open: false,
    disableHostCheck: true,
    proxy: {
      '/api/': {
        target: process.env.VUE_APP_API + '/',
        // target:  'http://47.106.247.123:8080/',
        // target: 'http://rap2api.taobao.org/',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '', // app/mock/94968
        // },
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
      app.all('*', function (req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With');
        res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
        res.header('X-Powered-By', '3.2.1');
        if (req.method === 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      })
    }
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
      .set('styles', path.resolve(__dirname, './src/styles'));

    // 优化打包，拆分app.js
    // config.optimization
    //   .splitChunks({
    //     // chunks: 'all',
    //     cacheGroups: {
    //       antd: {
    //         name: "chunk-antdUI",
    //         priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
    //         test: /[\\/]node_modules[\\/]h3-mobile-vue[\\/]/
    //       },
    //       antdVue: {
    //         name: "chunk-antdVue-UI",
    //         priority: 19, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
    //         test: /[\\/]node_modules[\\/]h3-antd-vue[\\/]/
    //       },
    //       antd: {
    //         name: "chunk-form-renderer",
    //         priority: 18, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
    //         test: /[\\/]node_modules[\\/]h3-form-renderer-vue[\\/]/
    //       },
    //       moment: {
    //         name: "chunk-moment",
    //         priority: 12,
    //         test: /[\\/]node_modules[\\/]moment[\\/]/
    //       },
    //       rxjs: {
    //         name: "chunk-rxjs",
    //         priority: 11,
    //         test: /[\\/]node_modules[\\/]rxjs[\\/]/
    //       },
    //       libs: {
    //         name: 'chunk-libs',
    //         test: /[\\/]node_modules[\\/]/,
    //         priority: 10,
    //         chunks: 'initial' // 只打包初始时依赖的第三方
    //       },
    //       commons: {
    //         name: 'chunk-commons',
    //         // test: resolve('packages'), // 可自定义拓展你的规则
    //         minChunks: 3, // 最小公用次数
    //         priority: 5,
    //         reuseExistingChunk: true
    //       }
    //     }
    //   })
    //   .runtimeChunk({
    //     name: "runtime"
    //   });
    // 删除预加载, preload删除方式一样
    ['main', 'externalLink'].map(name => config.plugins.delete(`prefetch-${name}`))
    // 配置打包分析
    // if (process.env.npm_config_report) {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(BundleAnalyzerPlugin)
    // }
  }
};

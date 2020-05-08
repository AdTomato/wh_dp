const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const themeVars = require('@h3/theme-pc/presets/cloudpivot/back');

const defaultCssVars = require('@cloudpivot/common/styles/variable').admin;

const extendLessVars = require('./extends/theme');

const modifyVars = Object.assign({}, defaultCssVars, extendLessVars);

themeVars.modifyVars = Object.assign(themeVars.modifyVars, modifyVars)

// 分包dll
const webpack = require('webpack');
const dllPath = "./public/vendor/";
const { library } = require("./dll.config.js");

// 引入生成的 dll 文件
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
// 显示打包进度和时间
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');

const CopyWebpackPlugin = require('copy-webpack-plugin');

let pages = {
  main: {
    entry: 'src/main.ts',
    template: 'public/index.html',
    filename: 'index.html'

  },
  template: {
    entry: 'src/template/index.ts'
  }
};
if (process.env.NODE_ENV === 'debug') {
  // pages.template = Object.assign(pages.template,{
  //     template: 'src/template/index.html', //开发环境页面
  //     filename: 'template.html'
  // });
  /**
   * 开发环境的ROOT模板测试路径
   */
  pages.rooTemplate = {
    entry: 'src/template/index.ts',
    template: 'src/template/rootTemplate.html',
    filename: 'rootTemplate.html'
  };
}


module.exports = {
  publicPath: '/admin/',
  pages: pages,
  filenameHashing: false,
  productionSourceMap: true,
  transpileDependencies: ['vuex-persist', 'flatted', /@cloudpivot\/[\w-]+/],
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      config.devtool = 'source-map';
    } else {
      config.devtool = 'cheap-eval-source-map';
    }
    // config.devtool = process.env.NODE_ENV === 'production' ? 'eval' : 'eval-source-map';

    return {
      plugins: [
        ...Object.keys(library).map(name => {
          return new webpack.DllReferencePlugin({
            context: __dirname,
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
            publicPath: '/admin/vendor',
            // dll最终输出的目录
            outputPath: '/vendor'
          }
        })),
        new SimpleProgressWebpackPlugin(),
        new MonacoWebpackPlugin({
          languages: ["javascript", "css", "html", "json"]
        }),
        // new BundleAnalyzerPlugin(),
        new CopyWebpackPlugin([
          {
            from: path.resolve(__dirname, '../../modules/@cloudpivot/form/src/renderer/components/pc/input-textarea/tinymcelib'),
            to: 'tinymcelib',
            ignore: ['.*']
          }
        ])
      ]
    };
  },
  devServer: {
    port: 9000,
    open: true,
    proxy: {
      '/api/': {
        target: process.env.VUE_APP_API + '/',
        changeOrigin: true,
        // pathRewrite: {
        //   '^/api': '', // app/mock/94968
        // },
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
        if (req.method == 'OPTIONS') {
          res.sendStatus(200);
        } else {
          next();
        }
      })
    }
  },
  parallel: require('os').cpus().length > 1,
  css: {
    loaderOptions: {
      less: {
        ...themeVars,
        modifyVars: modifyVars,
        // modifyVars: {
        //   'primary-color': '#17BC94', // 全局主色
        //   'heading-color': 'rgba(0, 0, 0, .65)', // 标题色 (表格的head)
        //   'text-color': 'rgba(0, 0, 0, .85)', // 主题文字颜色
        //   // 'link-color': '#1890ff',                            // 链接色
        //   // 'success-color': '#52c41a',                        // 成功色
        //   // 'warning-color': '#faad14',                         // 警告色
        //   // 'error-color': '#f5222d',                          // 错误色
        //   // 'font-size-base': '14px',                          // 主字号
        //   // 'heading-color': 'rgba(0, 0, 0, .85)',             // 标题色
        //   // 'text-color': 'rgba(0, 0, 0, .65)',               // 主文本色
        //   // 'text-color-secondary': 'rgba(0, 0, 0, .45)',     // 次文本色
        //   // 'disabled-color': 'rgba(0, 0, 0, .25)',            // 失效色
        //   // 'border-radius-base': '4px',                        // 组件/浮层圆角
        //   // 'border-color-base': '#d9d9d9' ,                   // 边框色
        //   // 'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)'  // 浮层阴影
        // },
        javascriptEnabled: true,
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('assets', path.resolve(__dirname, './src/assets'))
      .set('styles', path.resolve(__dirname, './src/styles'))

    // 配置打包分析
    if (process.env.npm_config_report) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(BundleAnalyzerPlugin)
    }
    // 删除预加载
    ['main', 'template', 'rooTemplate'].map(name => config.plugins.delete(`prefetch-${name}`))

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 1024 }))
    config.optimization
      .splitChunks({
        minSize: 100000,
      })

    // config.module.rule('ts').use('ts-loader').tap(options => Object.assign(options, {
    //   getCustomTransformers: () => ({
    //     before: [ tsImportPluginFactory([
    //       {
    //         libraryName: 'h3-antd-vue',
    //         libraryDirectory: 'lib',
    //         style: true,
    //       }, {
    //         libraryName: 'h3-awesome-ui',
    //         libraryDirectory: 'lib',
    //         style: true,
    //       }])]
    //   }),
    //   // include: path.join(__dirname, 'node_modules/h3-antd-pro/components'),
    // }));


  }
};

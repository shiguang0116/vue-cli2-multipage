'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

const baseWebpackConfig = {
  context: path.resolve(__dirname, '../'),
  entry: Object.assign(getEntries(), {
    app: './src/main.js'
  }),
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}

// 处理入口文件
function getEntries(){
  const entries = {};
  // 生成入口文件
  const pages = utils.getModules('./src/pages/**/*.vue');
  for(let pageCode in pages) {
    const entryFile = `./entry/${pageCode}.js`;
    fs.exists(entryFile, function (exists) {  // 这里没有对文件目录进行判断，所以需要先建一个'entry'文件夹，否则会报错
      if (exists) return;
      const appTpl = '.' + pages[pageCode];
      const entryData = ` import Vue from 'vue';\n import App from '${appTpl}';\n Vue.config.productionTip = false;\n new Vue({ el: '#${pageCode}', components: { App }, template: '<App/>' }); `;
      fs.writeFile(entryFile, entryData, function (err) {
        if (err) console.log(err);
      });
    });
    // 获取入口文件数据
    entries[pageCode] = entryFile;
  }
  // const entries = utils.getModules('./entry/*.js');
  return entries;
}

// 构建多页面
const pagesJson = require('../config/page.json');
const pages = utils.getModules('./src/pages/**/*.vue');

for(let pageCode in pages) {
  // 自定义页面数据
  const pageData = pagesJson[pageCode] || {};
  Object.assign(pageData, {
    url: pages[pageCode],
    code: pageCode
  });
  // 配置生成的html文件
  const conf = {
    filename: pageCode + '.html',
    template: './index.html', // 模板路径
    favicon: './favicon.ico',
    inject: true,
    chunks: ['manifest', 'vendor', 'app', pageCode],   // 引入资源文件
    chunksSortMode: 'manual',       // 控制 chunk 的排序。none | auto（默认）| dependency（依赖）| manual（手动）| {function}
    pageData: pageData
  };
  if(!baseWebpackConfig.plugins) baseWebpackConfig.plugins = [];
  baseWebpackConfig.plugins.push(new HtmlWebpackPlugin(conf));
}

// vux-ui
const vuxLoader = require('vux-loader');
module.exports = vuxLoader.merge(baseWebpackConfig, {
  plugins: ['vux-ui']
});
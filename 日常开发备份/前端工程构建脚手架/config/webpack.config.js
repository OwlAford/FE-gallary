const argv = require('yargs').argv
const webpack = require('webpack')
const cssnano = require('cssnano')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const project = require('./project.config')
const debug = require('debug')('app:config:webpack')

const path = require('path')
const rootPath = path.resolve(__dirname, '..')
const src = path.join(rootPath, 'src')

const __DEV__ = project.globals.__DEV__
const __PROD__ = project.globals.__PROD__

debug('Creating configuration.')

const webpackConfig = {
  name    : 'client',
  target  : 'web',
  devtool : project.compiler_devtool,
  resolve : {
    root       : project.paths.client(),
    extensions : ['', '.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      // 自定义路径别名
      // ASSET: path.join(src, 'assets'),
    }  
  },
  module : {}
}
// 文件入口
const APP_ENTRY = project.paths.client('main.js')

webpackConfig.entry = {
  app : __DEV__
    ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${project.compiler_public_path}__webpack_hmr`)
    : [APP_ENTRY],
  vendor : project.compiler_vendors
}

// 打包输出目录
webpackConfig.output = {
  filename      : `js/[name].[${project.compiler_hash_type}].js`,
  chunkFilename : `js/[name].[${project.compiler_hash_type}].js`,
  path          : project.paths.dist(),
  publicPath    : project.compiler_public_path
}

// Externals
webpackConfig.externals = {}

// Plugins
webpackConfig.plugins = [
  new webpack.DefinePlugin(project.globals),
  new HtmlWebpackPlugin({
    template : project.paths.client('index.html'),
    hash     : false,
    favicon  : project.paths.public('favicon.ico'),
    filename : 'index.html',
    inject   : 'body',
    minify   : {
      removeComments     : true,    
      collapseWhitespace : true
    }
  })
]

// 确保编译器不被跳过和误报
if (!argv.watch) {
  webpackConfig.plugins.push(function() {
    this.plugin('done', stats => {
      if (stats.compilation.errors.length) {
        throw new Error(stats.compilation.errors.map(err => err.message || err))
      }
    })
  })
}

if (__DEV__) {
  debug('Enabling plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
} else if (__PROD__) {
  debug('Enabling plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress : {
        unused    : true,
        dead_code : true,
        warnings  : false
      }
    })
  )
}

// webpackConfig.plugins.push(
//   new webpack.optimize.CommonsChunkPlugin({
//     names : ['vendor', 'manifest']
//   })
// )

// 配置加载器
webpackConfig.module.loaders = [{
  test    : /\.(js|jsx)$/,
  exclude : /node_modules/,
  loader  : 'babel',
  query   : project.compiler_babel
}, {
  test    : /\.json$/,
  loader  : 'json'
}]

// 样式加载器
const BASE_CSS_LOADER = 'css?sourceMap&-minimize'

webpackConfig.module.loaders.push({
  test    : /\.scss$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'sass?sourceMap'
  ]
})
webpackConfig.module.loaders.push({
  test    : /\.less$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss',
    'less?sourceMap'
  ]
})
webpackConfig.module.loaders.push({
  test    : /\.css$/,
  exclude : null,
  loaders : [
    'style',
    BASE_CSS_LOADER,
    'postcss'
  ]
})

webpackConfig.sassLoader = {
  includePaths : project.paths.client('styles')
}

webpackConfig.postcss = [
  cssnano({
    autoprefixer : {
      add      : true,
      remove   : true,
      browsers : ['last 2 versions']
    },
    discardComments : {
      removeAll : true
    },
    discardUnused : false,
    mergeIdents   : false,
    reduceIdents  : false,
    safe          : true,
    sourcemap     : true
  })
]

const loaderGenerator = (loader, prefix, path, limit, mimetype) => `${loader}?${prefix ? 'prefix=fonts/' : ''}&name=${path}/[name].[hash:8].[ext]${limit ? '&limit=8192' : ''}${mimetype ? '' : '&mimetype=' + mimetype}`

// 文件加载器
webpackConfig.module.loaders.push({ 
  test: /\.woff(\?.*)?$/,  
  loader: loaderGenerator('url', true, 'img/fonts', true, 'application/font-woff')
}, { 
  test: /\.woff2(\?.*)?$/, 
  loader: loaderGenerator('url', true, 'img/fonts', true, 'application/font-woff2') 
}, { 
  test: /\.otf(\?.*)?$/,   
  loader: loaderGenerator('file', true, 'img/fonts', true, 'font/opentype') 
}, { 
  test: /\.ttf(\?.*)?$/,   
  loader:  loaderGenerator('url', true, 'img/fonts', true, 'application/octet-stream') 
}, { 
  test: /\.eot(\?.*)?$/,   
  loader: loaderGenerator('file', true, 'img/fonts', false, false) 
}, { 
  test: /\.svg(\?.*)?$/,   
  loader: loaderGenerator('url', true, 'img/fonts', true, 'image/svg+xml') 
},{ 
  test: /\.(png|jpg|gif)$/,    
  loader: loaderGenerator('url', false, 'img', true, false) 
})

if (!__DEV__) {
  debug('Applying ExtractTextPlugin to CSS loaders.')
  webpackConfig.module.loaders.filter(loader =>
    loader.loaders && loader.loaders.find(name => /css/.test(name.split('?')[0]))
  ).forEach(loader => {
    const first = loader.loaders[0]
    const rest = loader.loaders.slice(1)
    loader.loader = ExtractTextPlugin.extract(first, rest.join('!'))
    delete loader.loaders
  })

  webpackConfig.plugins.push(
    new ExtractTextPlugin('css/[name].[contenthash:8].css', {
      allChunks : true
    })
  )
}

module.exports = webpackConfig

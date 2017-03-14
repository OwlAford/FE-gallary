const express = require('express')
const debug = require('debug')('app:server')
const webpack = require('webpack')
const request = require('request')
const webpackConfig = require('../config/webpack.config')
const project = require('../config/project.config')
const compress = require('compression')

const app = express()

// 重写所有路由请求到根目录文件夹
app.use(require('connect-history-api-fallback')())

// 启用gzip压缩
app.use(compress())


// 启用 Webpack HMR Middleware
if (project.env === 'development') {
  const compiler = webpack(webpackConfig)

  debug('Enabling webpack dev and HMR middleware')
  
  app.use(require('webpack-dev-middleware')(compiler, {
    publicPath  : webpackConfig.output.publicPath,
    contentBase : project.paths.client(),
    hot         : true,
    quiet       : project.compiler_quiet,
    noInfo      : project.compiler_quiet,
    lazy        : false,
    stats       : project.compiler_stats
  }))
  app.use(require('webpack-hot-middleware')(compiler))

  app.use(express.static(project.paths.public()))

  //代理转发，解决跨域问题
  if (project.service_agent) {
    app.use('/', (req, res) => {
      const url = `${project.remote_host}${req.url}`
      debug(`[PROXY]: ${url}`)
      req.pipe(request(url)).pipe(res)
    })
  }

} else {
  debug('Server is being run outside of live development mode')
  app.use(express.static(project.paths.dist()))
}


module.exports = app

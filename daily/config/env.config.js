module.exports = {
  // 开发环境编译配置
  development : config => ({
    compiler_public_path : `http://${config.server_host}:${config.server_port}/`
  }),

  // 生产环境编译配置
  production : config => ({
    compiler_public_path     : config.project_name ? `/${config.project_name}/` : '/',
    compiler_fail_on_warning : true,
    compiler_hash_type       : 'chunkhash:8',
    compiler_devtool         : null,
    compiler_stats           : {
      chunks       : true,
      chunkModules : true,
      colors       : true
    }
  })
}

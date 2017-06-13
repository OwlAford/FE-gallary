const project = require('../config/project.config')
const server = require('../server/main')
const debug = require('debug')('app:bin:dev-server')
const opn = require('opn')

const uri = `http://localhost:${project.server_port}`

server.listen(project.server_port, err => {
  if (err) {
    debug(err)
    return
  }
  if (project.autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
debug(`Server is now running at ${uri}.`)

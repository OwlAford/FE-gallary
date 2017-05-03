const ip = require('ip')
const opn = require('opn')
const path = require('path')
const chalk = require('chalk')
const express = require('express')

const server = express()
const rootPath = path.resolve()

const uri = `http://${ip.address()}:5000`
server.use('/', express.static(path.join(rootPath, 'webapp')))

server.listen(5000, error => {
  if (error) {
    throw error
  } 
  console.log(chalk.green(`Server is running at ${uri}`))  
  opn(uri)
})
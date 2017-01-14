'use strict'

const finalhandler = require('finalhandler')
const app = require('./router')
const http = require('http')

module.exports = http.createServer(
  (req, res) => app(
    req, res, finalhandler(req, res)
  )
)

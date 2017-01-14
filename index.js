'use strict'

require('dotenv').config({silient: true})
require('now-logs')('phim.clgt.vn')

const server = require('./lib/server')

server.listen(process.env.PORT, () => {
  console.log(`app run on http://0.0.0.0:${process.env.PORT}`)
})

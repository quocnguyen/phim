'use strict'

const qs = require('querystring')
const ctrl = require('./ctrl')
const consolidate = require('consolidate')
const {resolve} = require('path')
const Router = require('router')
const url = require('url')
const compression = require('compression')
const serveStatic = require('serve-static')
const helmet = require('helmet')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const DAY_IN_MILISECOND = 24 * 60 * 60 * 1000

const app = Router()

// gzip
app.use(
  compression({
    level: process.env.COMPRESSION_LEVEL || 1
  })
)

// assets
app.use(
  serveStatic(
    resolve(__dirname, '..', 'public'),
    {
      maxAge: DAY_IN_MILISECOND
    }
  )
)

// render
app.use(
  (req, res, next) => {
    res.render = (filename, params = {}) => {
      const path = resolve(__dirname, '..', 'views', filename)
      res.locals = res.locals || {}
      consolidate.mustache(
        path,
        Object.assign(params, res.locals),
        (err, html) => {
          if (err) { throw err }
          res.setHeader('Content-Type', 'text/html; charset=utf8')
          res.end(html)
        }
      )
    }
    next()
  }
)

// query string
app.use(
  (req, res, next) => {
    req.query = qs.parse(
      url.parse(req.url).query
    )
    next()
  }
)

// parse body
app.use((req, res, next) => {
  req.body = {}
  if (req.method !== 'POST') { return next() }

  let body = ''
  req.on('data', (buf) => {
    body += buf.toString()
  })
  req.on('end', () => {
    req.body = qs.parse(body)
    next()
  })
})

// enable cookie
app.use(cookieParser())

// helmet best practise protection
app.use(helmet())

// csrf protection
app.use(
  csurf({
    cookie: true
  })
)
// assign csrfToken to view
app.use(
  (req, res, next) => {
    res.locals = res.locals || {}
    res.locals.csrfToken = req.csrfToken()
    next()
  }
)

app.get('/', ctrl.home.index)
app.get('/search', ctrl.home.handleSearchVideos)
app.get('/watch', ctrl.home.watch)
module.exports = app

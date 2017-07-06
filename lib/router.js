'use strict'

const qs = require('querystring')
const ctrl = require('./ctrl')
const consolidate = require('consolidate')
const { resolve } = require('path')
const Router = require('router')
const url = require('url')
const compression = require('compression')
const serveStatic = require('serve-static')
const helmet = require('helmet')
const cookieParser = require('cookie-parser')
const kindOf = require('kind-of')
const DAY_IN_MILISECOND = 24 * 60 * 60 * 1000

const app = Router()

app.use((req, res, next) => {
  res.json = obj => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json; charset=utf8')
    res.end(JSON.stringify(obj))
  }
  next()
})

// gzip
app.use(
  compression({
    level: process.env.COMPRESSION_LEVEL || 1
  })
)

// assets
app.use(
  serveStatic(resolve(__dirname, '..', 'public'), {
    maxAge: DAY_IN_MILISECOND
  })
)

const publicApi = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST,GET,OPTIONS,PUT,DELETE,HEAD'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Access-Control-Allow-Credentials',
      'Access-Control-Allow-Headers',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Origin'
    ].join(', ')
  )
  next()
}

// render
app.use((req, res, next) => {
  res.render = (filename, params = {}) => {
    const path = resolve(__dirname, '..', 'views', filename)
    res.locals = res.locals || {}
    consolidate.mustache(
      path,
      Object.assign(params, res.locals),
      (err, html) => {
        if (err) {
          throw err
        }
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
      }
    )
  }
  next()
})

// query string
app.use((req, res, next) => {
  req.query = qs.parse(url.parse(req.url).query)
  next()
})

// parse body
app.use((req, res, next) => {
  req.body = {}
  if (req.method !== 'POST') {
    return next()
  }

  let body = ''
  req.on('data', buf => {
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

// assign csrfToken to view
app.use((req, res, next) => {
  res.locals = res.locals || {}
  if (kindOf(req.csrfToken) === 'function') {
    res.locals.csrfToken = req.csrfToken()
  }
  next()
})

app.get('/', ctrl.home.index)
app.get('/search', ctrl.home.handleSearchVideos)
app.get('/watch', ctrl.home.watch)
app.get('/api/search', publicApi, ctrl.home.handleApi)
module.exports = app

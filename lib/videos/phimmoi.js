'use strict'

const aes = require('../aes')
const got = require('got')
const cheerio = require('cheerio')
const qs = require('querystring')
// const tunnel = require('tunnel')
const DOMAIN = 'http://www.phimmoi.net'
const provider = 'PM'

const gotOptions = {
  headers: {
    'user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.3',
    'Upgrade-Insecure-Requests': 1
  },
  timeout: 5000,
  retries: 0
  // agent: tunnel.httpOverHttp({
  //   proxy: {
  //     host: '128.199.254.57',
  //     port: 6969
  //   }
  // })
}

exports.search = query => {
  let q = qs.escape(query)

  return new Promise(resolve => {
    _search(q)
      .then(result => resolve(result))
      .catch(err => {
        console.log(err)
        resolve([])
      })
  })
}

function _search(q) {
  return got(`${DOMAIN}/tim-kiem/${q}/`, gotOptions)
    .then(response => cheerio.load(response.body))
    .then($ =>
      $('.list-movie')
        .find('.movie-item')
        .map((i, elem) => {
          let url = $(elem)
            .find('a.block-wrapper')
            .attr('href')
          let title = $(elem)
            .find('a.block-wrapper')
            .attr('title')
          // get last elem of arr without modified it
          let id = url
            .split('-')
            .slice(-1)
            .pop()
            .replace('/', '')
          const provider = 'PM'
          return {
            provider,
            id,
            title,
            url
          }
        })
        .get()
    )
}

exports.findMedias = url => {
  return findEpisodeUrl(url)
    .then(episodeUrl => {
      return got(
        episodeUrl.replace('javascript', 'json'),
        Object.assign({}, gotOptions, { json: true })
      )
    })
    .then(response => {
      const body = response.body
      const password = 'PhimMoi.Net@' + body.episodeId
      return body.medias.map(video => ({
        provider,
        // url: decodeUrl(video.url, password),
        url: video.url,
        type: video.type,
        width: video.width,
        height: video.height,
        resolution: parseFloat(video.resolution),
        label: video.resolution
      }))
    })
}

const findEpisodeUrl = id => {
  return got(`${DOMAIN}/${id}xem-phim.html`, gotOptions)
    .then(response => cheerio.load(response.body))
    .then($ => $('script[onload="checkEpisodeInfoLoaded(this)"]').attr('src'))
}

// decode url using the password
const decodeUrl = (url, password) => {
  return aes.dec(url, password)
}

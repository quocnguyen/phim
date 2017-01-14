'use strict'

const phimmoi = require('./videos/phimmoi')
const bilutv = require('./videos/bilutv')
const phimbathu = require('./videos/phimbathu')
const banhtv = require('./videos/banhtv')

exports.search = (query) => {
  return Promise.all([
    phimmoi.search(query),
    bilutv.search(query),
    phimbathu.search(query),
    banhtv.search(query)
  ]).then(result => {
    return result.reduce(
      (acc, cur) => acc.concat(cur),
      []
    )
  })
}

exports.findMedias = ({provider, url}) => {
  if (provider === 'PM') {
    return phimmoi.findMedias(url)
  }

  if (provider === 'BL') {
    return bilutv.findMedias(url)
  }

  if (provider === 'PBH') {
    return phimbathu.findMedias(url)
  }

  if (provider === 'BAH') {
    return banhtv.findMedias(url)
  }

  return Promise.resolve([])
}

'use strict'
const test = require('ava')
const phimmoi = require('../lib/videos/phimmoi')

test('phimmoi search videos', async t => {
  const videos = await phimmoi.search('kubo')
  t.is(videos.length, 1)
})

'use strict'
const test = require('ava')
const phimbathu = require('../lib/videos/phimbathu')

test('find medias', async t => {
  const medias = await phimbathu.findMedias('http://phimbathu.com/xem-phim/phim-den-thuong-de-cung-phai-cuoi-phan-2-the-gods-must-be-crazy-2-1990-3879')
  t.is(medias.length, 2)
})

test('search videos', async t => {
  const videos = await phimbathu.search('kubo')
  console.log(videos)
  t.is(videos.length, 2)
})

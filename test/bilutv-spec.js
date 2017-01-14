'use strict'
const test = require('ava')
const bilutv = require('../lib/videos/bilutv')
const aes = require('../lib/aes')

test('find medias', async t => {
  const medias = await bilutv.findMedias('http://bilutv.com/xem-phim/phim-den-thuong-de-cung-phai-cuoi-phan-2-the-gods-must-be-crazy-2-1990-3879')
  t.is(medias.length, 2)
})

test('search videos', async t => {
  const videos = await bilutv.search('kubo')
  t.is(videos.length, 1)
})

test.only('decode link back up', t => {
  const link = aes.dec('U2FsdGVkX1+TkfeDlTgOnw6ThlOjwfLUROCjTsVXPVLiXvQx5Z7nRYMJgy9mlya9X7ufnGW1kpjx0pyxdR3fgn9VwYjmwgyOxVH+9MPHw4CFMIykVCCYvowFTcTz52n3D11ZTYiIz8q5HRwFtRCwCrpdEFmYINgNCTnxxY0t1LM=', 'bilutv.com45904818773916')
  console.log(link)
  t.pass()
})

const express = require('express')
const router = express()
const Essay = require('../models/essay')

// 获取所有文章
router.get('/get-essay', function(req, res) {
  const { keywords, username } = req.query
  Essay.find({ username }, function(err, docs) {
    if (!err) res.send(docs)
  })
})
// 获取筛选的文章
router.get('/essay-search', function(req, res) {
  const { username, keywords } = req.query
  const _filter = {
    $or: [
      { title: { $regex: keywords, $options: '$i' } },
      { date: { $regex: keywords, $options: '$i' } }
    ]
  }
  Essay.where({ username })
    .where(_filter)
    .exec(function(err, docs) {
      console.log(docs)
      res.send(docs)
    })
})

module.exports = router

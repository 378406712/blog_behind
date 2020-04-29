const express = require('express')
const router = express()
const Essay = require('../models/essay')

router.get('/get-essay', function(req, res) {
  console.log(req.query)
  const { keywords, username } = req.query
  Essay.find({ username }, function(err, docs) {
    if (!err) res.send(docs)
  })
})

module.exports = router

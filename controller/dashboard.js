const express = require('express')
const router = express()
const Dashboard = require('../models/dashboard')
const ObjectId = require('mongodb').ObjectId

router.post('/set-todo', function (req, res) {
  const { username } = req.body
  Dashboard.findOneAndUpdate(
    { username },
    req.body,
    { upsert: true, new: true },
    function (err, docs) {
        res.send(docs)
    }
  )
})
router.get('/get-todo', function (req, res) {
  const { username } = req.query
  Dashboard.find({ username }, function (err, docs) {
    if (docs.length !== 0) {
      console.log(docs)
      res.send(docs)
    }
  })
})

module.exports = router

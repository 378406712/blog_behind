const express = require('express')
const router = express()
const Category = require('../models/category')
const ObjectId = require('mongodb').ObjectId

router.post('/BatchDeleteCategory', function(req,res) {
  console.log(req.body)
    let delData = JSON.parse(req.body._id)
    let newData = []
    delData.map(item => {
      newData.push(ObjectId(item))
    })
    Category.deleteMany(
      {
        _id: {
          $in: newData
        }
      },
      function(err, docs) {
        if (!err) console.log(docs)
      }
    )
})
module.exports = router

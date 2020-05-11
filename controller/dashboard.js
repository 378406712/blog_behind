const express = require('express')
const router = express()
const Dashboard = require('../models/dashboard')
const ObjectId = require('mongodb').ObjectId

router.post('/set-todo', function (req, res) {
    const {username} = req.body
  Dashboard.findOneAndUpdate({username},req.body,function(err,docs){
      if(!docs){
          console.log('插入')
        Dashboard.insertMany(req.body, function (err, docs) {
            if (!err) {
              res.send(docs)
            } else {
              console.log(err)
            }
          })
      }else{
        console.log('更新')
        console.log(docs)
        res.send(docs)
      }
  })
})

module.exports = router

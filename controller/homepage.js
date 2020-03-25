const express = require('express')
const router = express()
const Devices = require('../models/devices')
const ObjectId = require('mongodb').ObjectId
const STATUS = require('../common/const')

// 获取用户系统信息
router.get('/getDevices', function(req, res) {
  const { username } = req.query
  Devices.find({ username }, function(err, data) {
    if (data) {
      res.send(data)
    }
  })
})
// 删除用户系统信息(单条)
router.post('/deleteDevice', function(req, res) {
  let { _id } = req.body
  Devices.remove({ _id: ObjectId(_id) }, function(err) {
    if (!err) return res.send({ status: STATUS.SUCCESS })
  })
})
// 批量删除用户系统信息
router.post('/BatchDeleteDevices', function(req, res) {
  let delData = JSON.parse(req.body._id)
  let newData = []
  delData.map(item => {
    newData.push(ObjectId(item))
  })
  Devices.deleteMany(
    {
      _id: {
        $in: newData
      }
    },
    function(err) {
      if (!err) res.send({ status: STATUS.SUCCESS })
    }
  )
})

module.exports = router

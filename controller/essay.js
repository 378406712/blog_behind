const express = require('express')
const router = express()
const Essay = require('../models/essay')
const ObjectId = require('mongodb').ObjectId
const STATUS = require('../common/const')

// 获取所有文章
router.get('/get-essay', function (req, res) {
  const { username, keyword } = req.query
  console.log(username, keyword)
  let keywords = {}
  switch (keyword) {
    case 'all':
      keywords = { username }
      break
    case 'trash':
      keywords = { username, trash: true }
      break
    case 'draft':
      keywords = { username, draft: true }
      break
    case 'sended':
      keywords = { username, reCheck: false, draft: false, trash: false }
      break
    case 'pend':
      keywords = { username, reCheck: true }
      break
  }
  Essay.find(keywords, function (err, docs) {
    console.log(docs)
    if (!err) res.send(docs)
  })
})
// 获取搜索的文章
router.get('/essay-search', function (req, res) {
  const { username, keywords } = req.query
  let _filter = {
    $or: [
      { title: { $regex: keywords, $options: '$i' } },
      { date: { $regex: keywords, $options: '$i' } },
      { checkCategory: { $regex: keywords, $options: '$i' } }
    ]
  }
  if (req.query.tag) {
    _filter = {
      $or: [{ checkCategory: { $regex: keywords, $options: '$i' } }]
    }
  }

  Essay.where({ username })
    .where(_filter)
    .exec(function (err, docs) {
      res.send(docs)
    })
})
// 获取筛选的文章
router.get('/essay-filter', function (req, res) {
  const { username, checkCategory, date } = req.query
  if (checkCategory === 'all-category' && date === 'all-date') {
    Essay.where({ username }).exec(function (err, docs) {
      res.send(docs)
    })
  } else if (checkCategory === 'all-category' || date === 'all-date') {
    const _filter = {
      $or: [
        { checkCategory: { $regex: checkCategory, $options: '$i' } },
        { selectDate: { $regex: date, $options: '$i' } }
      ]
    }
    Essay.where({ username })
      .where(_filter)
      .exec(function (err, docs) {
        res.send(docs)
      })
  } else {
    const _filter = {
      $or: [{ checkCategory: { $regex: checkCategory, $options: '$i' } }]
    }
    Essay.where({ username, selectDate: date })
      .where(_filter)
      .exec(function (err, docs) {
        res.send(docs)
      })
  }
})
// 批量删除文章
router.post('/BatchDeleteEssay', function (req, res) {
  const _id = JSON.parse(req.body._id)
  let newData = []
  _id.map((item) => {
    newData.push(ObjectId(item))
  })

  Essay.deleteMany(
    {
      _id: {
        $in: newData
      }
    },
    function (err, docs) {
      if (!err) {
        res.send({ status: STATUS.SUCCESS })
      }
    }
  )
})
// 批量移入回收站
router.post('/BatchTrashEssay', function (req, res) {
  let _id = JSON.parse(req.body._id)
  const { tag } = req.body
  let newData = []
  if (tag === 'batch') {
    _id.map((item) => {
      newData.push(ObjectId(item))
    })
  } else {
    newData.push(_id)
  }

  Essay.updateMany(
    {
      _id: {
        $in: newData
      }
    },
    {
      $set: {
        trash: true,
        draft: false,
        reCheck: false,
        sended: false
      }
    },
    function (err, docs) {
      if (!err) {
        res.send({ status: STATUS.SUCCESS })
      }
    }
  )
})
// 获取文章信息中的日期
router.get('/essay-date', function (req, res) {
  Essay.find(req.query, function (err, docs) {
    if (!err) res.send(docs)
  })
})
module.exports = router

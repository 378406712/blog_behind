// Models/devices.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 声明一个数据集 对象
const deviceSchema = new Schema(
  {
    username: String,
    ip: String,
    os: String,
    digits: String,
    browser: Object,
    time: String
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('devices', deviceSchema)

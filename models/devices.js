// Models/devices.js

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 声明一个数据集 对象
let deviceSchema = new Schema(
  {
    username: String,
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

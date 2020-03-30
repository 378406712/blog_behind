// Models/devices.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 设备信息
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

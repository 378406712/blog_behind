// Models/dashboard.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 设备信息
const dashboardSchema = new Schema(
  {
   username:String,
   todo:Array,
   text:String,
   done:Boolean
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('dashboard', dashboardSchema)

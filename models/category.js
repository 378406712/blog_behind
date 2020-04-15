// Models/category.js

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 文章目录
const categorySchema = new Schema(
  {
    username: String,
    category: String,
    alias: String,
    desc: String,
    pic: String,
    sum:Number
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('category', categorySchema)

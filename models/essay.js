const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 文章内容
const Essay = new Schema(
  {
    essay: String,
    title: String,
    category: Array,
    essayStatus: String,
    essayPassword: String,
    username: String,
    password: String,
    reCheck: Boolean,
    keepTop: Boolean
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('essay', Essay)

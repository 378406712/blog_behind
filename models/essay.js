const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 文章内容
const Essay = new Schema(
  {
    essay: String,
    title: String,
    radioVisible: String,
    special_bg: String,
    checkCategory: Array,
    essayStatus: String,
    essayPassword: String,
    username: String,
    nickname: String,
    password: String,
    reCheck: Boolean,
    keepTop: Boolean,
    commentOn: Boolean,
    draft: Boolean,
    trash: Boolean,
    sended: Boolean,
    date: String,
    time: String,
    commentData: Array,
    selectDate: String
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('essay', Essay)

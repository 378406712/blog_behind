const mongoose = require('mongoose')
const Schema = mongoose.Schema
//媒体资源
const MediaSchema = new Schema(
  {
    file: String,
    username: String,
    size: String,
    pic_width: Number,
    pic_height: Number,
    media_title: String,
    file_name: String,
    description: String,
    date: String,
    selectDate: String
  },
  {
    versionKey: false
  }
)
module.exports = mongoose.model('Media', MediaSchema)

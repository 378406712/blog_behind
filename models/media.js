const mongoose = require('mongoose')
const Schema = mongoose.Schema
//媒体资源
const MediaSchema = new Schema(
  {
    file: String
  },
  {
    versionKey: false
  }
)
module.exports = mongoose.model('Media', MediaSchema)

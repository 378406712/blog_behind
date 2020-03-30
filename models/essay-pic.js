const mongoose = require('mongoose')
const Schema = mongoose.Schema
//文章图片
const PersonalSchema = new Schema(
  {
    file: String
  },
  {
    versionKey: false
  }
)
module.exports = mongoose.model('EssayPic', PersonalSchema)

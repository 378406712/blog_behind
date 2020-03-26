const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalSchema = new Schema(
  {
    file: String
  },
  {
    versionKey: false
  }
)
module.exports = mongoose.model('EssayPic', PersonalSchema)

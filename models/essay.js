const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalSchema = new Schema(
  {
    url: String,
    username: String
  },
  {
    versionKey: false
  }
)
module.exports = mongoose.model('newEssay', PersonalSchema)

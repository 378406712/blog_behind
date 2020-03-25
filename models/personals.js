const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PersonalSchema = new Schema(
  {
    url:String,
    username:String,
    nickname:String,
    birthday:String,
    sex:String,
    desc:String,
    hometown:Array,
    job:String
  },
  {
    versionKey: false
  }
)
module.exports = mongoose.model('personals', PersonalSchema)

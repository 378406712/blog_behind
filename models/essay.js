const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Essay = new Schema(
  {
    essay: String,
    title: String,
    essayStatus: String,
    essayPassword: String,
    username: String,
    password: String
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('essay', Essay)

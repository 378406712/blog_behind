const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Essay = new Schema(
  { essay: String, title: String, username: String },
  {
    versionKey: false
  }
)

module.exports = mongoose.model('essay', Essay)

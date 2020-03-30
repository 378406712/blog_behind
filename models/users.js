// Models/users.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 用户账号等
const userSchema = new Schema(
  {
    username: {
      type: String
    },
    password: {
      type: String
    },
    e_mail: String,
    token: String,
    permission: String,
    avatar: String
  },
  {
    versionKey: false
  }
)

// 将数据模型暴露出去
module.exports = mongoose.model('users', userSchema)

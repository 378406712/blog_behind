// Models/users.js

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 声明一个数据集 对象
let userSchema = new Schema(
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

// Models/users.js

var mongoose = require('mongoose')
var Schema = mongoose.Schema

// 声明一个数据集 对象
var userSchema = new Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  e_mail: String,
  token: String,
  permission: String,
  avatar: String,
  createAt: {
    type: Date,
    default: Date.now()
  }
})
// 将数据模型暴露出去
module.exports = mongoose.model('users', userSchema)

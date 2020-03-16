// 引入数据库
let mongoose = require('mongoose')
mongoose.set('useCreateIndex', true) //加上这个

mongoose.connect('mongodb://localhost/myBlog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}) //连接本地数据库blog

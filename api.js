const express = require('express')
const app = express()
const bodyParser = require('body-parser') //处理post
const model = require('./libs/connect') //引入model层
const fs = require('fs')
const generator = require('./common/generator') //加密
const getPublicKey = require('./controller/publicKey')
const user = require('./controller/user')
const login = require('./controller/login')
generator()
//加载upload中图片资源
app.use('/uploads', express.static(__dirname + '/public/upload'))
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)
app.use('/key',getPublicKey)
app.use('/user', user)

// Promise检错提示
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
})

app.listen('3001', () => {
  console.log('3001端口开启成功')
})

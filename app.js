// const STATUS = require('./const')
// const express = require('express') //引入express模块
// const app = express()

// const bodyParser = require('body-parser') //处理post
// const timeStamp = require('time-stamp') // 时间
// // var multiparty = require('multiparty') //处理图片上传
// const crypto = require('crypto') //加密
// const uuid = require('uuid/v1') //uuid  随机生成图片名字
// //设置后台加密内容
// const secret = '3123e;lkjfldsjfpsa[ofj'
// //引入path
// const path = require('path')
// const formidable = require('formidable')
// //后台生成秘钥
// const NodeRSA = require('node-rsa')
// const fs = require('fs')
// //生成公钥
// function generator() {
//   var key = new NodeRSA({
//     b: 512
//   })
//   key.setOptions({
//     encryptionScheme: 'pkcs1'
//   })

//   var privatePem = key.exportKey('pkcs1-private-pem')
//   var publicPem = key.exportKey('pkcs8-public-pem')

//   fs.writeFile('./pem/public.pem', publicPem, err => {
//     if (err) throw err
//     console.log('公钥已保存！')
//   })
//   fs.writeFile('./pem/private.pem', privatePem, err => {
//     if (err) throw err
//     console.log('私钥已保存！')
//   })
// }
// generator()
// //获取公钥
// app.get('/getPublicKey', (req, res) => {
//   try {
//     let publicKey = fs.readFileSync('./pem/public.pem', 'utf-8')
//     console.log('publicKey', publicKey)
//     res.send({
//       status: 0,
//       msg: '公钥获取成功',
//       resultmap: publicKey
//     })
//   } catch (err) {
//     res.send(err)
//   }
// })
// //后端解密--再加密
// function savePass(pwd) {
//   const privateKey = fs.readFileSync('./pem/private.pem', 'utf8') //读取私钥
//   let buffer1 = Buffer.from(pwd, 'base64') //转化格式
//   let password = crypto
//     .privateDecrypt(
//       {
//         key: privateKey,
//         padding: crypto.constants.RSA_PKCS1_PADDING // 注意这里的常量值要设置为RSA_PKCS1_PADDING
//       },
//       buffer1
//     )
//     .toString('utf8')
//   console.log('解密之后的密码', password)

//   let b_password = crypto
//     .createHmac('sha256', secret)
//     .update(password)
//     .digest('hex') //后端加密

//   return b_password
// }
// app.use('/uploads', express.static(__dirname + '/public/upload'))
// app.use(bodyParser.json())
// app.use(
//   bodyParser.urlencoded({
//     extended: false
//   })
// )
// const MongoClient = require('mongodb') //数据库
// const ObjectId = require('mongodb').ObjectId
// const DBurl = 'mongodb://127.0.0.1:27017/myBlog'

// //用户登录
// app.post('/login/login', function(req, res) {
//   const { username, password } = req.body
//   let b_password = savePass(password)
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('register').findOne(
//       {
//         username
//       },
//       function(er, rs) {
//         if (rs) {
//           if (rs.b_password === b_password) {
//             console.log(rs.b_password, 111111111111) //数据库中加密密码
//             console.log(b_password, 22222222222) //前端传来的密码，解密后再加密 的密码
//             res.send({
//               status: STATUS.SUCCESS, //密码正确
//               e_mail: rs.e_mail,
//               username: rs.username,
//               token: rs.token
//             })
//           } else {
//             res.send({
//               status: STATUS.PASSWORD_ERROR //密码错误
//             })
//           }
//         } else {
//           res.send({
//             status: STATUS.UNFIND //不存在该用户
//           })
//         }
//       }
//     )
//   })
// })
// //用户登陆信息
// app.post('/user/getInfo', function(req, res) {
//   const { username } = req.body
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('register').findOne(
//       {
//         username
//       },
//       function(er, rs) {
//         res.send(rs)
//       }
//     )
//   })
// })
// //用户登出
// app.post('/login/logout', function(req, res) {
//   res.send('SUCCESS')
// })
// //传递用户系统信息(浏览器，操作系统信息)
// app.post('/login/DeviceInfo', function(req, res) {
//   const { username, os, digits, browser } = req.body
//   let ip = req.ip.slice(7)
//   let time = timeStamp('YYYY-MM-DD HH:mm:ss')
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('userServerData').insertOne({
//       username,
//       os,
//       digits,
//       browser,
//       ip,
//       time
//     })
//   })
// })
// //获取用户系统信息
// app.get('/homepage/getServerInfo', function(req, res) {
//   const { username } = req.query
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('userServerData')
//       .find({
//         username
//       })
//       .toArray(function(err, result) {
//         if (result) {
//           res.send(result)
//         }
//       })
//   })
// })
// //删除用户系统信息(单条)
// app.post('/homepage/deleteServerInfo', function(req, res) {
//   let { _id } = req.body
//   console.log(_id)
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('userServerData').remove({
//       _id: ObjectId(_id)
//     })
//     res.send({ status: STATUS.SUCCESS })
//   })
// })
// //批量删除用户系统信息
// app.post('/homepage/BatchDeleteDevices', function(req, res) {
//   let delData = JSON.parse(req.body._id)
//   let newData = []
//   delData.map(item => {
//     newData.push(ObjectId(item))
//   })
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('userServerData').deleteMany(
//       {
//         _id: {
//           $in: newData
//         }
//       },
//       function(er, rs) {
//         res.send({
//           status: STATUS.SUCCESS
//         })
//       }
//     )
//   })
// })
// //修改用户账号密码
// app.post('/user/passAlter', function(req, res) {
//   const { username, originPass, newPass } = req.body
//   const b_password1 = savePass(originPass) //原密码
//   const b_password2 = savePass(newPass) //修改的密码
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('register').findOne(
//       {
//         username
//       },
//       function(er, rs) {
//         if (rs) {
//           if (rs.b_password == b_password1) {
//             //update
//             db.collection('register').update(
//               {
//                 b_password: rs.b_password
//               },
//               {
//                 $set: {
//                   b_password: b_password2
//                 }
//               },

//               function(e, r) {
//                 if (!e) {
//                   res.send({
//                     status: STATUS.SUCCESS
//                   }) //修改成功
//                 }
//               }
//             )
//           } else {
//             res.send({
//               status: STATUS.PASSWORD_ERROR //原密码错误
//             })
//           }
//         }
//       }
//     )
//   })
// })
// //添加用户信息
// app.post('/user/userInfoAdd', function(req, res) {
//   //图片信息
//   let form = formidable.IncomingForm()
//   form.uploadDir = path.normalize(__dirname + '/public/tempDir')
//   form.parse(req, (err, fields, files) => {
//     //非图片信息,不需要存图片信息
//     let {
//       url,
//       username,
//       nickname,
//       birthday,
//       sex,
//       desc,
//       hometown,
//       job
//     } = JSON.parse(fields.message)

//     let upLoadFile = files.file
//     //存在图片时
//     if (upLoadFile) {
//       let extname = path.extname(upLoadFile.name) //后缀名
//       let filename = uuid() + extname //文件名
//       let oldPath = upLoadFile.path
//       let newPath = path.join(__dirname, 'public/upload', filename)
//       let uploadUrl = `http://localhost:3001/uploads/${filename}`
//       fs.rename(oldPath, newPath, err => {
//         if (!err) {
//           MongoClient.connect(DBurl, function(err, db) {
//             db.collection('userInfo').findOne(
//               {
//                 username
//               },
//               function(er, rs) {
//                 if (!rs) {
//                   db.collection('userInfo').insertOne(
//                     {
//                       url: uploadUrl,
//                       username,
//                       nickname,
//                       desc,
//                       sex,
//                       hometown,
//                       job,
//                       birthday
//                     },
//                     function(er, rs) {
//                       if (rs) {
//                         res.send({ status: STATUS.SUCCESS }) //用户信息插入成功
//                       }
//                     }
//                   )
//                 } else {
//                   db.collection('userInfo').findOneAndUpdate(
//                     {
//                       username
//                     },
//                     {
//                       url: uploadUrl,
//                       username,
//                       nickname,
//                       desc,
//                       sex,
//                       hometown,
//                       job,
//                       birthday
//                     },
//                     function(er, rs) {
//                       if (rs) {
//                         res.send({ status: STATUS.UPDATE }) //用户信息更新成功
//                       }
//                     }
//                   )
//                 }
//               }
//             )
//           })

//           console.log('上传成功') //上传成功
//         } else {
//           console.log('上传失败')
//         }
//       })
//     } else {
//       MongoClient.connect(DBurl, function(err, db) {
//         db.collection('userInfo').findOne(
//           {
//             username
//           },
//           function(er, rs) {
//             if (!rs) {
//               db.collection('userInfo').insertOne(
//                 {
//                   username,
//                   nickname,
//                   desc,
//                   sex,
//                   hometown,
//                   job,
//                   birthday
//                 },
//                 function(er, rs) {
//                   if (rs) {
//                     res.send({ status: STATUS.SUCCESS }) //用户信息插入成功
//                   }
//                 }
//               )
//             } else {
//               db.collection('userInfo').findOneAndUpdate(
//                 {
//                   username
//                 },
//                 {
//                   url,
//                   username,
//                   nickname,
//                   desc,
//                   sex,
//                   hometown,
//                   job,
//                   birthday
//                 },
//                 function(er, rs) {
//                   if (rs) {
//                     res.send({ status: STATUS.UPDATE }) //用户信息更新成功
//                   }
//                 }
//               )
//             }
//           }
//         )
//       })
//     }
//   })
// })
// //获取用户信息
// app.get('/user/userInfoGet', function(req, res) {
//   let { username } = req.query
//   console.log('123')
//   MongoClient.connect(DBurl, function(err, db) {
//     db.collection('userInfo').findOne(
//       {
//         username
//       },
//       function(er, rs) {
//         if (rs) {
//           console.log('找到了')
//           res.send(rs)
//         }else{
//           console.log('没找到')
//         }
//       }
//     )
//   })
// })
// //删除用户账号
// app.post('/user/userRemove', function(req, res) {
//   let { username } = req.body
//   console.log(username)
//   MongoClient.connect(DBurl, function(err, db) {
//     //删除注册表信息
//     if (!err) {
//       db.collection('register').remove({
//         username
//       })
//       //删除登陆表信息
//       db.collection('userServerData').remove({
//         username
//       })
//       //删除信息表信息
//       // db.collection('userInfo').remove({
//       //   e_mail
//       // })
//       res.send({
//         status: STATUS.SUCCESS
//       }) //删除成功
//     } else {
//       res.send({
//         status: STATUS.ERROR
//       }) //删除失败
//     }
//   })
// })

// // Promise检错提示
// process.on('unhandledRejection', (reason, p) => {
//   console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
// })

// app.listen('3001', () => {
//   console.log('3001端口开启成功')
// })

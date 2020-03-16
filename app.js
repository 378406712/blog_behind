// const STATUS = require('./const')
// const express = require('express') //引入express模块
// const app = express()

// const bodyParser = require('body-parser') //处理post
// const timeStamp = require('time-stamp') // 时间
// // var multiparty = require('multiparty') //处理图片上传
// const crypto = require('crypto') //加密
// const uuid = require('uuid/v1') //uuid  随机生成图片名字


// const MongoClient = require('mongodb') //数据库
// const ObjectId = require('mongodb').ObjectId
// const DBurl = 'mongodb://127.0.0.1:27017/myBlog'





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

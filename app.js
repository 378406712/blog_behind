let express = require("express")//引入express模块

let app = express();
let bodyParser = require("body-parser") //处理post
var multiparty = require('multiparty');//处理图片上传
const crypto = require('crypto')//加密
//设置加密内容
const secret = '3123e;lkjfldsjfpsa[ofj'

app.use('/upload', express.static('upload'))//存放图片的upload文件夹
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

let MongoClient = require("mongodb")//数据库
let ObjectId = require('mongodb').ObjectId;
let DBurl = 'mongodb://127.0.0.1:27017/myBlog'




let fs = require('fs')//fs模块

//用户注册
app.post("/userRegister", function (req, res) {
    let { username, password, e_mail } = req.body;
    password = crypto.createHmac('sha256', secret).update(password).digest("hex")//加密
    MongoClient.connect(DBurl, function (err, db) {
        db.collection("register").findOne({
            username
        }, function (er, rs) {
            if (rs) {
                console.log(-1)//用户名重复-1
                res.send('-1')
            }
            else {

                db.collection("register").findOne({ e_mail }, function (e, r) {
                    if (r) {
                        //邮箱重复0
                        res.send('0')
                    }
                    else {
                        db.collection("register").insertOne({
                            username, password, e_mail
                        }, function (e, r) {
                            if (r.insertedId) {
                                //插入成功1
                                console.log('插入成功1')
                                res.send("1")
                            }
                            else {
                                console.log('插入失败2')
                                res.send("2")
                            }
                        })
                    }
                })
            }
        })
    })
})


process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
    // Promise检错提示
});




app.listen("3001", () => {
    console.log("3001端口开启成功")
})
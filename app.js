let express = require("express")//引入express模块

let app = express();
let bodyParser = require("body-parser") //处理post
var multiparty = require('multiparty');//处理图片上传
const crypto = require('crypto')//加密
//设置后台加密内容
const secret = '3123e;lkjfldsjfpsa[ofj'


//后台生成秘钥
const NodeRSA = require('node-rsa');
const fs = require('fs');
//生成公钥
function generator() {
    var key = new NodeRSA({ b: 512 })
    key.setOptions({ encryptionScheme: 'pkcs1' })

    var privatePem = key.exportKey('pkcs1-private-pem')
    var publicPem = key.exportKey('pkcs8-public-pem')

    fs.writeFile('./pem/public.pem', publicPem, (err) => {
        if (err) throw err
        console.log('公钥已保存！')
    })
    fs.writeFile('./pem/private.pem', privatePem, (err) => {
        if (err) throw err
        console.log('私钥已保存！')
    })
}
generator();
//获取公钥
app.get('/getPublicKey', (req, res) => {
    try {
        let publicKey = fs.readFileSync('./pem/public.pem', 'utf-8');
        console.log('publicKey', publicKey)
        res.send({ 'status': 0, 'msg': '公钥获取成功', 'resultmap': publicKey });
    } catch (err) {
        res.send(err);
    }
})



app.use('/upload', express.static('upload'))//存放图片的upload文件夹
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))

let MongoClient = require("mongodb")//数据库
let ObjectId = require('mongodb').ObjectId;
let DBurl = 'mongodb://127.0.0.1:27017/myBlog'






//用户注册
app.post("/userRegister", function (req, res) {
    let { username, e_mail } = req.body; //获取非加密用户名和邮箱

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
                        const privateKey = fs.readFileSync('./pem/private.pem', 'utf8'); //读取私钥
                        let buffer1 = Buffer.from(req.body.password, 'base64'); //转化格式
                        let password = crypto.privateDecrypt({
                            key: privateKey,
                            padding: crypto.constants.RSA_PKCS1_PADDING // 注意这里的常量值要设置为RSA_PKCS1_PADDING
                        }, buffer1).toString('utf8');
                        console.log('解密之后的密码', password);

                        let b_password = crypto.createHmac('sha256', secret).update(password).digest("hex")//后端加密
                        db.collection("register").insertOne({
                            username, b_password, e_mail
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

//用户登录
app.post("/userLogin", function (req, res) {
    let { username } = req.body;

    MongoClient.connect(DBurl, function (err, db) {

        const privateKey = fs.readFileSync('./pem/private.pem', 'utf8'); //读取私钥
        let buffer1 = Buffer.from(req.body.password, 'base64'); //转化格式
        let password = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING // 注意这里的常量值要设置为RSA_PKCS1_PADDING
        }, buffer1).toString('utf8');
         console.log('解密之后的密码', password);

        let b_password = crypto.createHmac('sha256', secret).update(password).digest("hex")//后端加密



        db.collection("register").findOne({
            username
        }, function (er, rs) {
            if (rs) {
          
               // res.send('0')
               console.log(rs)
               if (rs.b_password === b_password) {
                //密码正确,返回1
                console.log(rs.b_password,111111111111)//数据库中加密密码
                console.log(b_password,22222222222)//前端传来的密码，解密后再加密 的密码
                res.send('1')
            }
            else {
                //密码错误,返回2
                res.send('2')
            }
            }
            else{
                //未查到该用户,返回0
                res.send('0')
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
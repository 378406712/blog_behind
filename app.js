let express = require("express"); //引入express模块

let app = express();
let bodyParser = require("body-parser"); //处理post
let timeStamp = require("time-stamp"); // 时间
var multiparty = require("multiparty"); //处理图片上传
const crypto = require("crypto"); //加密
//设置后台加密内容
const secret = "3123e;lkjfldsjfpsa[ofj";

//后台生成秘钥
const NodeRSA = require("node-rsa");
const fs = require("fs");
//生成公钥
function generator() {
  var key = new NodeRSA({ b: 512 });
  key.setOptions({ encryptionScheme: "pkcs1" });

  var privatePem = key.exportKey("pkcs1-private-pem");
  var publicPem = key.exportKey("pkcs8-public-pem");

  fs.writeFile("./pem/public.pem", publicPem, err => {
    if (err) throw err;
    console.log("公钥已保存！");
  });
  fs.writeFile("./pem/private.pem", privatePem, err => {
    if (err) throw err;
    console.log("私钥已保存！");
  });
}
generator();
//获取公钥
app.get("/getPublicKey", (req, res) => {
  try {
    let publicKey = fs.readFileSync("./pem/public.pem", "utf-8");
    console.log("publicKey", publicKey);
    res.send({ status: 0, msg: "公钥获取成功", resultmap: publicKey });
  } catch (err) {
    res.send(err);
  }
});

//后端解密--再加密
function savePass(pwd) {
  const privateKey = fs.readFileSync("./pem/private.pem", "utf8"); //读取私钥
  let buffer1 = Buffer.from(pwd, "base64"); //转化格式
  let password = crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING // 注意这里的常量值要设置为RSA_PKCS1_PADDING
      },
      buffer1
    )
    .toString("utf8");
  console.log("解密之后的密码", password);

  let b_password = crypto
    .createHmac("sha256", secret)
    .update(password)
    .digest("hex"); //后端加密

  return b_password;
}

app.use("/upload", express.static("upload")); //存放图片的upload文件夹
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

let MongoClient = require("mongodb"); //数据库
let ObjectId = require("mongodb").ObjectId;
let DBurl = "mongodb://127.0.0.1:27017/myBlog";

//用户注册
app.post("/userRegister", function(req, res) {
  let { username, password, e_mail } = req.body; //获取非加密用户名和邮箱

  MongoClient.connect(DBurl, function(err, db) {
    db.collection("register").findOne(
      {
        username
      },
      function(er, rs) {
        if (rs) {
         
          res.send("-1"); //用户名重复-1
        } else {
          db.collection("register").findOne({ e_mail }, function(e, r) {
            if (r) {
              //邮箱重复0
              res.send("0");
            } else {
              let b_password = savePass(password); //后端再加密端 密码 存入数据库

              db.collection("register").insertOne(
                {
                  username,
                  b_password,
                  e_mail
                },
                function(e, r) {
                  if (r.insertedId) {
                    //插入成功1
                    console.log("插入成功1");
                    res.send("1");
                  } else {
                    console.log("插入失败2");
                    res.send("2");
                  }
                }
              );
            }
          });
        }
      }
    );
  });
});

//用户登录
app.post("/userLogin", function(req, res) {
  let { username, password } = req.body;

  MongoClient.connect(DBurl, function(err, db) {
    let b_password = savePass(password);

    db.collection("register").findOne(
      {
        username
      },
      function(er, rs) {
        if (rs) {
          if (rs.b_password === b_password) {
            //密码正确,返回1
            console.log(rs.b_password, 111111111111); //数据库中加密密码
            console.log(b_password, 22222222222); //前端传来的密码，解密后再加密 的密码

            res.send({
              status: "1",
              e_mail: rs.e_mail,
              username: rs.username
            });
          } else {
            //密码错误,返回2
            res.send({
              status: "2"
            });
          }
        } else {
          //未查到该用户,返回0
          res.send({
            status: "0"
          });
        }
      }
    );
  });
});

//传递用户信息(浏览器，操作系统信息)
app.post("/postUserInfo", function(req, res) {
  // console.log("headers = " + JSON.stringify(req.headers));// 包含了各种header，包括x-forwarded-for(如果被代理过的话)
  // console.log("x-forwarded-for = " + req.header('x-forwarded-for'));// 各阶段ip的CSV, 最左侧的是原始ip
  // console.log("ips = " + JSON.stringify(req.ips));// 相当于(req.header('x-forwarded-for') || '').split(',')
  // console.log("remoteAddress = " + req.connection.remoteAddress);// 未发生代理时，请求的ip
  // console.log("ip = " + req.ip);// 同req.connection.remoteAddress, 但是格式要好一些

  let { username, os, digits, browser } = req.body;
  let ip = req.ip.slice(7);
  let time = timeStamp("YYYY-MM-DD HH:mm:ss");

  MongoClient.connect(DBurl, function(err, db) {
    db.collection("userInfo").insertOne(
      {
        username,
        os,
        digits,
        browser,
        ip,
        time
      },
      function(er, rs) {
        console.log(rs);
      }
    );
  });
  res.send("用户信息获取成功");
});

//获取用户登录信息
app.get("/getUserInfo", function(req, res) {
  let { username } = req.query;

  MongoClient.connect(DBurl, function(err, db) {
    db.collection("userInfo")
      .find({ username })
      .toArray(function(err, result) {
        if (!err) {
          res.send(result);
        }
      });
  });
});

//删除用户登录信息
app.get("/deleteUserInfo", function(req, res) {
  let { _id } = req.query;
  console.log(ObjectId(_id));
  MongoClient.connect(DBurl, function(err, db) {
    db.collection("userInfo").remove({
      _id: ObjectId(_id)
    });
  });
  res.send("删除成功");
});

//修改用户账号密码
app.post("/userPassAlter", function(req, res) {
  let { e_mail, originPass, againPass } = req.body;

  let b_password1 = savePass(originPass); //原密码
  let b_password2 = savePass(againPass); //修改的密码

  MongoClient.connect(DBurl, function(err, db) {
    db.collection("register").findOne({ e_mail }, function(er, rs) {
      if (rs) {
        
        if (rs.b_password == b_password1) {
          //update
          db.collection("register").update(
            { 'b_password': rs.b_password },
            { $set: { 'b_password': b_password2 } },

            function(e, r) {
              if (!e) {
                res.send({ status: "0" }); //修改成功
              }
            }
          );
        } else {
          res.send({
            status: "1" //原密码错误
          });
        }
      } else {
        res.send({ status: "2" }); //网络问题
      }
    });
  });
});
//删除用户账号
app.get("/userRemove",function(req,res){
    let {e_mail} = req.query
    console.log(e_mail)
    MongoClient.connect(DBurl,function(err,db){
        db.collection("register").remove({e_mail},function(er,rs){
            if(rs){
              res.send({"status":'0'}) //删除成功
            }
        })
    })
})

// Promise检错提示
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

app.listen("3001", () => {
  console.log("3001端口开启成功");
});

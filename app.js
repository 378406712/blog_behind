let express = require("express"); //引入express模块

let app = express();
let bodyParser = require("body-parser"); //处理post
let timeStamp = require("time-stamp"); // 时间
var multiparty = require("multiparty"); //处理图片上传
const crypto = require("crypto"); //加密
const uuid = require("uuid/v1"); //uuid  随机生成图片名字
const querystring = require("querystring"); //序列化与反序列化
//设置后台加密内容
const secret = "3123e;lkjfldsjfpsa[ofj";
//引入path
let path = require("path");
let formidable = require("formidable");

//后台生成秘钥
const NodeRSA = require("node-rsa");
const fs = require("fs");
//生成公钥
function generator() {
  var key = new NodeRSA({
    b: 512
  });
  key.setOptions({
    encryptionScheme: "pkcs1"
  });

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
    res.send({
      status: 0,
      msg: "公钥获取成功",
      resultmap: publicKey
    });
  } catch (err) {
    res.send(err);
  }
});

//后端解密--再加密
function savePass(pwd) {
  const privateKey = fs.readFileSync("./pem/private.pem", "utf8"); //读取私钥
  let buffer1 = Buffer.from(pwd, "base64"); //转化格式
  let password = crypto
    .privateDecrypt({
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
app.use("/uploads", express.static(__dirname + "/public/upload"));
// console.log(__dirname + "/public/upload");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

let MongoClient = require("mongodb"); //数据库
let ObjectId = require("mongodb").ObjectId;
let DBurl = "mongodb://127.0.0.1:27017/myBlog";
/**
 * 重复：-1
 * 成功：0
 * 失败：1
 */

//用户注册
app.post("/register", function (req, res) {
  let {
    username,
    password,
    e_mail,
    token,
    avatar,
    permission
  } = req.body; //获取非加密用户名和邮箱

  MongoClient.connect(DBurl, function (err, db) {
    db.collection("register").findOne({
        username
      },
      function (er, rs) {
        if (rs) {
          res.send("-1"); //用户名重复-1
        } else {
          db.collection("register").findOne({
            e_mail
          }, function (e, r) {
            if (r) {
              //邮箱重复0
              res.send("0");
            } else {
              let b_password = savePass(password); //后端再加密端 密码 存入数据库
              db.collection("register").insertOne({
                  username,
                  b_password,
                  e_mail,
                  token,
                  avatar,
                  permission
                },
                function (e, r) {
                  if (r.insertedId) {
                    //插入成功1
                    console.log("插入成功1");
                    res.send("1");
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
app.post("/login/login", function (req, res) {
  let {
    username,
    password
  } = req.body;

  let b_password = savePass(password);
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("register").findOne({
        username
      },
      function (er, rs) {
        if (rs) {
          if (rs.b_password === b_password) {
            //密码正确,返回1
            console.log(rs.b_password, 111111111111); //数据库中加密密码
            console.log(b_password, 22222222222); //前端传来的密码，解密后再加密 的密码
            res.send({
              status: 1,
              e_mail: rs.e_mail,
              username: rs.username,
              token: rs.token
            });
          } else {
            //密码错误,返回-1
            res.send({
              status: -1
            });
          }
        } else {
          //未查到该用户,返回0
          res.send({
            status: 0
          });
        }
      }
    );
  });
});
//用户登陆信息
app.post('/user/getInfo', function (req, res) {
  let {
    username
  } = req.body
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("register").findOne({
        username
      },
      function (er, rs) {
        res.send(rs);
      }
    );
  });
})
//用户登出
app.post('/login/logout', function (req, res) {
  res.send('success')
})

//传递用户系统信息(浏览器，操作系统信息)
app.post("/login/DeviceInfo", function (req, res) {
  let {
    username,
    os,
    digits,
    browser
  } = req.body;
  let ip = req.ip.slice(7);
  let time = timeStamp("YYYY-MM-DD HH:mm:ss");

  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userServerData").insertOne({
      username,
      os,
      digits,
      browser,
      ip,
      time
    });
  });

});

//获取用户系统信息
app.get("/homepage/getServerInfo", function (req, res) {
  let {
    username
  } = req.query;
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userServerData")
      .find({
        username
      })
      .toArray(function (err, result) {
        if (result) {
          res.send(result);
        }
      });
  });
});

//删除用户系统信息
app.post("/homepage/deleteServerInfo", function (req, res) {
  let {
    _id
  } = req.body;
  console.log(_id)
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userServerData").remove({
      _id: ObjectId(_id)
    })
    res.send('删除成功')

  });

});
//批量删除用户系统信息
app.get("/deleteAllServerInfo", function (req, res) {
  let delData = JSON.parse(req.query._id);
  let newData = [];
  delData.map(item => {
    newData.push(ObjectId(item));
  });
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userServerData").deleteMany({
        _id: {
          $in: newData
        }
      },
      function (er, rs) {
        res.send({
          status: "0"
        });
      }
    );
  });
});

//修改用户账号密码
app.post("/userPassAlter", function (req, res) {
  let {
    e_mail,
    originPass,
    againPass
  } = req.body;

  let b_password1 = savePass(originPass); //原密码
  let b_password2 = savePass(againPass); //修改的密码

  MongoClient.connect(DBurl, function (err, db) {
    db.collection("register").findOne({
      e_mail
    }, function (er, rs) {
      if (rs) {
        if (rs.b_password == b_password1) {
          //update
          db.collection("register").update({
              b_password: rs.b_password
            }, {
              $set: {
                b_password: b_password2
              }
            },

            function (e, r) {
              if (!e) {
                res.send({
                  status: "0"
                }); //修改成功
              }
            }
          );
        } else {
          res.send({
            status: "1" //原密码错误
          });
        }
      } else {
        res.send({
          status: "2"
        }); //网络问题
      }
    });
  });
});
//添加用户信息
app.post("/userInfoAdd", function (req, res) {
  //图片信息
  let form = formidable.IncomingForm();
  form.uploadDir = path.normalize(__dirname + "/public/tempDir");
  form.parse(req, (err, fields, files) => {
    //非图片信息,不需要存图片信息
    let birthday = JSON.parse(fields.message).birthday.slice(0, 10);
    let {
      src,
      url,
      e_mail,
      username,
      nickname,
      sex,
      desc,
      hometown,
      job
    } = JSON.parse(fields.message);
    let upLoadFile = files.file;
    //存在图片时
    if (upLoadFile) {
      let extname = path.extname(upLoadFile.name); //后缀名
      let filename = uuid() + extname; //文件名
      let oldPath = upLoadFile.path;
      let newPath = path.join(__dirname, "public/upload", filename);
      var uploadUrl = `http://localhost:3001/uploads/${filename}`;
      fs.rename(oldPath, newPath, err => {
        if (!err) {
          MongoClient.connect(DBurl, function (err, db) {
            db.collection("userInfo").findOne({
              username
            }, function (er, rs) {
              if (!rs) {
                db.collection("userInfo").insertOne({
                    uploadUrl,
                    e_mail,
                    username,
                    nickname,
                    desc,
                    sex,
                    hometown,
                    job,
                    birthday
                  },
                  function (er, rs) {
                    if (rs) {
                      res.send("0"); //用户信息插入成功
                    }
                  }
                );
              } else {
                db.collection("userInfo").findOneAndUpdate({
                    username
                  }, {
                    uploadUrl,
                    e_mail,
                    username,
                    nickname,
                    desc,
                    sex,
                    hometown,
                    job,
                    birthday
                  },
                  function (er, rs) {
                    if (rs) {
                      res.send("1"); //用户信息更新成功
                    }
                  }
                );
              }
            });
          });

          console.log("上传成功"); //上传成功
        } else {
          console.log("上传失败");
        }
      });
    } else {
      MongoClient.connect(DBurl, function (err, db) {
        db.collection("userInfo").findOne({
          username
        }, function (er, rs) {
          if (!rs) {
            db.collection("userInfo").insertOne({
                src,
                username,
                nickname,
                desc,
                sex,
                hometown,
                job,
                birthday
              },
              function (er, rs) {
                if (rs) {
                  res.send("0"); //用户信息插入成功
                }
              }
            );
          } else {
            var uploadUrl = url;
            db.collection("userInfo").findOneAndUpdate({
                username
              }, {
                uploadUrl,
                e_mail,
                username,
                nickname,
                desc,
                sex,
                hometown,
                job,
                birthday
              },
              function (er, rs) {
                if (rs) {
                  res.send("1"); //用户信息更新成功
                }
              }
            );
          }
        });
      });
    }
  });
});

//获取用户信息
app.get("/userInfoData", function (req, res) {
  let {
    username
  } = req.query;

  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userInfo").findOne({
      username
    }, function (er, rs) {
      if (rs) {
        res.send(rs);
      }
    });
  });
});
//删除用户账号
app.get("/userRemove", function (req, res) {
  let {
    e_mail,
    username
  } = req.query;

  MongoClient.connect(DBurl, function (err, db) {
    //删除注册表信息
    db.collection("register").remove({
      e_mail
    });
    //删除登陆表信息
    db.collection("userServerData").remove({
      e_mail
    });
    //删除信息表信息
    db.collection("userInfo").remove({
      e_mail
    });
    //删除统计表信息
    db.collection("userStatistical").remove({
      username: username
    });
  });

  res.send({
    status: "0"
  }); //删除成功
});

//数据统计
app.post("/optionStatistical", function (req, res) {
  console.log(req.body, "999999999999999999");
  let {
    username
  } = req.body;
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userStatistical").findOne({
      username
    }, function (er, rs) {
      if (!rs) {
        db.collection("userStatistical").insertOne(req.body);
      } else {
        db.collection("userStatistical").findOneAndUpdate({
            username
          },
          req.body,
          function (er, rs) {
            if (rs) {
              res.send("1"); //用户信息更新成功
            } else {
              console.log(er);
            }
          }
        );
      }
    });
  });
});
//获取统计数据
app.get("/optionStatistical", function (req, res) {
  let {
    username
  } = req.query;
  MongoClient.connect(DBurl, function (err, db) {
    db.collection("userStatistical")
      .find({
        username
      })
      .toArray(function (err, result) {
        if (result) {
          res.send(result);
        }
      });
  });
});

// Promise检错提示
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
});

app.listen("3001", () => {
  console.log("3001端口开启成功");
});
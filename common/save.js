const fs = require('fs')
const crypto = require('crypto') //加密

const secret = '3123e;lkjfldsjfpsa[ofj' //设置后台加密内容
//后端解密--再加密
function savePass(pwd) {
  const privateKey = fs.readFileSync('./pem/private.pem', 'utf8') //读取私钥
  let buffer1 = Buffer.from(pwd, 'base64') //转化格式
  let password = crypto
    .privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING // 注意这里的常量值要设置为RSA_PKCS1_PADDING
      },
      buffer1
    )
    .toString('utf8')
  console.log('解密之后的密码', password)

  let b_password = crypto
    .createHmac('sha256', secret)
    .update(password)
    .digest('hex') //后端加密

  return b_password
}
module.exports = savePass

const NodeRSA = require('node-rsa')
const fs = require('fs')
//生成公钥
function generator() {
  var key = new NodeRSA({
    b: 512
  })
  key.setOptions({
    encryptionScheme: 'pkcs1'
  })

  var privatePem = key.exportKey('pkcs1-private-pem')
  var publicPem = key.exportKey('pkcs8-public-pem')
  fs.writeFile('./pem/public.pem', publicPem, err => {
    if (err) throw err
    console.log('公钥已保存！')
  })
  fs.writeFile('./pem/private.pem', privatePem, err => {
    if (err) throw err
    console.log('私钥已保存！')
  })
}
module.exports = generator

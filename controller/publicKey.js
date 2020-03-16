var express = require('express')
const router = express.Router()
const fs = require('fs')
router.get('/getPublicKey', (req, res) => {
  try {
    let publicKey = fs.readFileSync('./pem/public.pem', 'utf-8')
    console.log('publicKey', publicKey)
    res.send({
      status: 0,
      msg: '公钥获取成功',
      resultmap: publicKey
    })
  } catch (err) {
    res.send(err)
  }
})
module.exports = router
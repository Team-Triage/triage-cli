const cryptoRandomString = require('crypto-random-string')

function getKey() {
  return cryptoRandomString({length: 24, type: base64})
}

module.exports = getKey
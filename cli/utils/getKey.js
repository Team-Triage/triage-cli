function getKey() {
  randomStr = require('crypto').randomBytes(32).toString('hex');
  return randomStr
}

module.exports = getKey
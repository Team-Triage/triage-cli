
function getKey() {
  return randomStr = () => require('crypto').randomBytes(32).toString('hex')();
}

module.exports = getKey
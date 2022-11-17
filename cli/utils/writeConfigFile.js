fs = require('fs')

function writeConfigFile(path, string) {
  fs.writeFileSync(path, string, {flag: 'a'})
}

module.exports = writeConfigFile

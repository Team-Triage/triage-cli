fs = require('fs')

function writeConfigFile(path, string) {
  let logger = fs.createWriteStream(path, {
    flag: 'a'
  })
  logger.write(string)
}

module.exports = writeConfigFile

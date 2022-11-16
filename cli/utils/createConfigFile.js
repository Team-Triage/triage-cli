fs = require('fs')

function createConfigFile(path) {
  let logger = fs.createWriteStream(path, {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
  logger.write(`topic.name=\n`) 
  logger.write('num.of.partitions= \n')
  logger.write('bootstrap.servers= \n') // append string to your file
  logger.write('session.timeout.ms= \n') 
}

module.exports = createConfigFile
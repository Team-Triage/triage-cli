fs = require('fs')

function createFile(path, topicName) {
  let logger = fs.createWriteStream(path, {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
  logger.write(`topic.name=${topicName}\n`) 
  logger.write('num.of.partitions= \n')
  logger.write('bootstrap_servers= \n') // append string to your file
  logger.write('session.timeout.ms= \n') 
}

module.exports = createFile
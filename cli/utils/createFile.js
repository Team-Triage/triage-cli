fs = require('fs')

function createFile() {
  let logger = fs.createWriteStream('config.properties', {
    flags: 'a' // 'a' means appending (old data will be preserved)
  })
  logger.write('bootstrap_servers= \n') // append string to your file
  logger.write('session.timeout.ms= \n') 
  logger.write('topic.name= \n') 
}

module.exports = createFile
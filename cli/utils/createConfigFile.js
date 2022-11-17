fs = require('fs')

function createConfigFile(path) {
  let logger = fs.createWriteStream(path)
  logger.write(`topic.name=\nnum.of.partitions=\nbootstrap.servers=\nsession.timeout.ms=\n`) 
}

module.exports = createConfigFile
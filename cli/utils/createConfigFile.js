fs = require('fs')

function createConfigFile(path) {
  fs.writeFileSync(path, `topic.name=\nnum.of.partitions=\nbootstrap.servers=\nsession.timeout.ms=\n`)
}

module.exports = createConfigFile
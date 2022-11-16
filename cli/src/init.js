import createConfigFile from '../utils/createConfigFile'

function init () {
  createConfigFile('config.properties')
  console.log("config.properties created!")
}

export default init
import createConfigFile from '../utils/createConfigFile'
import executeCommand from '../utils/executeCommand'
function init () {
  console.log("Creating config file: config.properties!")
  createConfigFile('config.properties')
  
  console.log("Getting the latest version of Triage")
  executeCommand("git clone https://github.com/team-triage/triage.git src && cd src && rm -rf .git")
}

export default init
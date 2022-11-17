import createConfigFile from '../utils/createConfigFile'
import executeCommand from '../utils/executeCommand'
function init () {
  console.log("Cleaning up")
  try {
    executeCommand("rm -rf src && rm config.properties")
  } catch (e) {
  }
  console.log("Done cleaning up")

  console.log("Creating config file: config.properties!")
  createConfigFile('config.properties')
  console.log("Done creating config file: config.properties!")
  
  console.log("Getting the latest version of Triage")
  executeCommand("mkdir src")
  console.log("Created ./src")
  executeCommand("git clone https://github.com/team-triage/triage.git src && cd src && rm -rf .git")
  console.log("Got the latest version of Triage into ./src")
  
}

export default init
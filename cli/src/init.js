import createConfigFile from '../utils/createConfigFile'
import executeCommand from '../utils/executeCommand'

function init () {
  cleanup()
  installDependencies()
  generateConfigFile()
}

function cleanup() {
  console.log("Cleaning up")
  try {
    executeCommand("rm -rf src triage-service && rm config.properties")
    executeCommand("rm package.json package-lock.json")
  } catch (e) {
  }
  console.log("Done cleaning up")

}

function installDependencies() {
  executeCommand("npm init -y")
  executeCommand("npm install aws-cdk-lib")

  console.log("Getting the latest version of Triage")
  executeCommand("git clone https://github.com/team-triage/triage.git src && cd src && rm -rf .git")
  console.log("Copied the latest version of Triage into ./src")

  console.log("Getting the latest version of triage-cdk")
  executeCommand("git clone https://github.com/team-triage/triage-cdk.git triage-service && cd triage-service && rm -rf .git")
  console.log("Copied the latest version of triage-cdk into triage-service")
}

function generateConfigFile() {
  console.log("Creating config file: config.properties!")
  createConfigFile('config.properties')
  console.log("Done creating config file: config.properties!")
}

export default init
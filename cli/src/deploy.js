import executeCommand from "../utils/executeCommand"
import PropertiesReader from "properties-reader"
import writeConfigFile from "../utils/writeConfigFile"
import getKey from '../utils/getKey'

function deploy() {
  copyConfigToSrc()
  const AuthKey = insertAuthKey()
  deployToAws()
  console.log(`This is the authentication token for your consuming applications: ${AuthKey}`)
}

function copyConfigToSrc() {
  console.log('Copying config.properties')
  executeCommand("cp config.properties src/config.properties")
}

function insertAuthKey() {
  console.log('Adding authentication token to config')

  const AuthKey = getKey()
  writeConfigFile('src/config.properties', `\nauthentication.token=${AuthKey}`)
  return AuthKey
}

function deployToAws() {
  console.log('Deploying!')
  const props = PropertiesReader('./src/config.properties')
  const TOPIC_NAME = props._properties['topic.name']
  const PARTITION_COUNT = props._properties['num.of.partitions']
  process.env.TOPIC_NAME = TOPIC_NAME
  process.env.PARTITION_COUNT = PARTITION_COUNT
  executeCommand("cd ./triage-service && echo | pwd && cdk bootstrap && cdk deploy")
}

export default deploy

import executeCommand from "../utils/executeCommand"
import PropertiesReader from "properties-reader"
import writeConfigFile from "../utils/writeConfigFile"
import getKey from '../utils/getKey'

function deploy() {
  
  console.log('Copying config.properties')
  executeCommand("cp config.properties src/config.properties")

  console.log('Adding authentication token to config')

  const authToken = getKey()
  writeConfigFile('src/config.properties', `\nauthentication.token=${authToken}`)
  
  console.log('Deploying!')
  const props = PropertiesReader('./src/config.properties')
  const TOPIC_NAME = props._properties['topic.name']
  const PARTITION_COUNT = props._properties['num.of.partitions']
  process.env.TOPIC_NAME = TOPIC_NAME
  process.env.PARTITION_COUNT = PARTITION_COUNT

  executeCommand("cd triage-service && cdk bootstrap && cdk deploy")
  console.log(`This is the authentication token for your consuming applications: ${authToken}`)
}

export default deploy

console.log("hello world")
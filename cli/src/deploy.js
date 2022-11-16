import executeCommand from "../utils/executeCommand"
import PropertiesReader from "properties-reader"

function deploy() {
  console.log('Copying config.properties')
  executeCommand("cp config.properties ./src/config.properties")

  // NEED TO ADD AUTH TOKEN TO config.properties

  console.log('Deploying!')
  const props = PropertiesReader('config.properties')
  const TOPIC_NAME = props._properties['topic.name']
  const PARTITION_COUNT = props._properties['num.of.partitions']
  process.env.TOPIC_NAME = TOPIC_NAME
  process.env.PARTITION_COUNT = PARTITION_COUNT
  executeCommand("cd triage-service && cdk bootstrap && cdk deploy")
}

export default deploy

/*
1. copy config properties into triage src
2. add auth token to config.properties
3. create new image with docker build
4. cdk prep 0- we already did this??
5. take topic name and interpolate it into cdk stack js file inside cd/lib

*/
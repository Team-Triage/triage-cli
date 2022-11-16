import executeCommand from "../utils/executeCommand"
import PropertiesReader from "properties-reader"

function deploy() {
  console.log('Copying config.properties')
  executeCommand("cp config.properties ./src/config.properties")
  // add auth token here

  console.log('Building image')
  executeCommand("cd src && echo | pwd && docker build -t triage:latest .")

  console.log('Deploying!')
  const TOPIC_NAME = PropertiesReader('config.properties')._properties['topic.name']
  executeCommand("echo | pwd && cdk deploy", {env: {"TOPIC_NAME": TOPIC_NAME}})
}

export default deploy

/*
1. copy config properties into triage src
2. add auth token to config.properties
3. create new image with docker build
4. cdk prep 0- we already did this??
5. take topic name and interpolate it into cdk stack js file inside cd/lib

*/
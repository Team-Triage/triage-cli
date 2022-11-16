import executeCommand from "../utils/executeCommand"
import init from './init'
import deploy from './deploy'

export function cli(args) {
  // console.log(args);
  let option = parseArgs(args)

  if (option == 1) {
    executeCommand("echo init: \"I'm a bash command!\"")
    init()
  } else {
    deploy()
    executeCommand("echo DEPLOY: \"I'm a bash command!\"")
  }
}

const options = {
  "init": 1,
  "deploy": 2,
  "-i": 1,
  "-d": 2,
}

function parseArgs(rawArgs) {
  let args = rawArgs.slice(2)
  return options[args[0]]
} 

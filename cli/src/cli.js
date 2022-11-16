import executeCommand from "../utils/executeCommand"
import init from './init'

export function cli(args) {
  // console.log(args);
  let option = parseArgs(args)

  if (option == 1) {
    executeCommand("echo init: \"I'm a bash command!\"")
    init()
  } else {
    deploy(console.log("I'm deploying!"))
    executeCommand("echo DEPLOY: \"I'm a bash command!\"")
  }
}

const options = {
  "init": 1,
  "deploy": 2,
  "-i": 1,
  "-d": 2,
}

function deploy() {}

function parseArgs(rawArgs) {
  let args = rawArgs.slice(2)
  return options[args[0]]
} 

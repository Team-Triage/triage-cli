import init from './init'
import deploy from './deploy'

export function cli(args) {
  let option = parseArgs(args)
  // write clause to catch no args
  if (option === 1) {
    init()
  } else {
    deploy()
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

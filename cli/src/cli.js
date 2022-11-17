import init from './init'
import deploy from './deploy'
import destroy from './destroy'

export function cli(args) {

  let option = parseArgs(args)
  // write clause to catch no args
  if (option === 1) {
    init()
  } else if (option === 2) {
    deploy()
  } else if (option === 3) {
    destroy()
  }
}

const options = {
  "init": 1,
  "-i": 1,
  "deploy": 2,
  "-d": 2,
  "destroy": 3,
  "-dest" : 3,
}

function parseArgs(rawArgs) {
  let args = rawArgs.slice(2)
  if (args.length === 0) {
    console.log("Please specify a command")
    // should implement more verbose/helpful information in the future
  }
  return options[args[0]]
} 

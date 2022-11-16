import createFile from "../utils/createFile";

function init () {
  console.log("About to create")
  createFile('config.properties')
  console.log("Created")
}

export default init
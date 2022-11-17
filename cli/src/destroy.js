const readlineSync = require("readline-sync")
const executeCommand = require("../utils/executeCommand");

function destroy() {
  const response = readlineSync.question("This will destroy your existing stack - are you sure you want to proceed? y/n\n")
  if (response === "y") {
    console.log("This could take some time - we recommend putting the kettle on ;)")
    executeCommand("cd triage-service && cdk destroy -f")
    console.log("AWS stack destroyed successfully!")
  }
  return 
}

module.exports = destroy
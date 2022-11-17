const { execSync } = require("child_process");

function executeCommand(command) {  
  execSync(command, {stdio: 'inherit'})
} 

module.exports = executeCommand;
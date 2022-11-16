const { exec } = require("child_process");


function executeCommand(command) {
  // let execution = exec('cd triage-undefined && npm init -y');
  let execution = exec(command);

  execution.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  execution.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });
  
  execution.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
} 

module.exports = executeCommand;
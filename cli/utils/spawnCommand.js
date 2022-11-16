const { spawn } = require("child_process");

function spawnCommand(command) {
  // let execution = exec('cd triage-undefined && npm init -y');
  let spawn = spawn(command);

  spawn.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });
  
  spawn.stderr.on('data', (err) => {
    console.error(`stderr: ${err}`);
  });
  
  spawn.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
} 

module.exports = spawnCommand;
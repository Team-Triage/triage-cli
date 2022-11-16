const fs = require("fs");

const folderName = process.argv[2] || "Project";

function createFolder (folderName) {
  const path = `./triage-${folderName}`;
  fs.access(path, (error) => {

  // check if the given directory exists or not
  if (error) {
	// If current directory does not exist then create it
	  fs.mkdir(path, (error) => {
	if (error) {
		console.log(error);
	} else {
		console.log("New Directory created successfully !!");
	  }
	  });
  } else {
	  console.log("Given Directory already exists !!");
    }
  });
}

module.exports = createFolder;
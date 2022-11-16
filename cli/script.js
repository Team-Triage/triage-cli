const fs = require("fs");
const exec = require('child_process').exec

const folderName = process.argv[2] || "Project";

const createFile = require("./utils/createFile");
const createFolder = require("./utils/createFolder");
const executeCommand = require("./utils/executeCommand");

createFolder()
executeCommand()
createFile()
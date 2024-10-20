const fs = require("fs");
const path = require("path");

// if there is no directory called new then create a new directory
if (!fs.existsSync("./new")) {
  fs.mkdir("./new", (error) => {
    if (error) throw error;
    console.log("made directory");
  });
}
// if there is a directory called new then delete  new directory
if (!fs.existsSync("./new")) {
  fs.rmdir("./new", (error) => {
    if (error) throw error;
    console.log(" directory removed");
  });
}

const fs = require("fs");
const path = require("path");
const fspromise = require("fs").promises;

// reads a file

fs.readFile(
  path.join(__dirname, "files", "starter.txt"),
  "utf8",
  (error, data) => {
    if (error) throw error;

    console.log(data);
  }
);

// does samething as above code
fs.readFile("./files/starter.txt", "utf8", (error, data) => {
  if (error) throw error;

  console.log(data);
});

const fileOps = async () => {
  try {
    const data = await fspromise.readFile(
      path.join(__dirname, "files", "starter.txt"),
      "utf8"
    );
    console.log(data);
    await fspromise.unlink(path.join(__dirname, "files", "starter.txt")); // deletes starter.txt from file tree
    await fspromise.writeFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      data
    );
    await fspromise.appendFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      "\n\n Nice to meet you"
    );
    await fspromise.rename(
      path.join(__dirname, "files", "promiseWrite.txt"),
      path.join(__dirname, "files", "promisecomplete.txt")
    );

    const newData = await fspromise.readFile(
      path.join(__dirname, "files", "promiseWrite.txt"),
      "utf8"
    );
    console.log(newData);
  } catch (error) {
    console.error(error);
  }
};

// writes a file

fs.writeFile(
  path.join(__dirname, "files", "reply.txt"),
  "Nice to meet you",

  (error) => {
    if (error) throw error;

    console.log("complete");

    fs.appendFile(
      path.join(__dirname, "files", "reply.txt"),
      "\n \n yes it is",

      (error) => {
        if (error) throw error;

        console.log("complete");

        fs.rename(
          path.join(__dirname, "files", "reply.txt"),
          path.join(__dirname, "files", "newreply.txt"),

          (error) => {
            if (error) throw error;

            console.log("complete");
          }
        );
      }
    );
  }
);

// exit uncaught errors

process.on("uncaughtExceptions", (err) => {
  console.error(`uncaught exception ${err}`);
  process.exit(1);
});

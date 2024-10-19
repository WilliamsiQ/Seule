const { format } = require("date-fns");
const fs = require("fs");
const path = require("path");
const fspromises = require("fs").promises; // uses async await

const { v4: uuid } = require("uuid");

const logEvent = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime} \t ${uuid()} \t ${message} \n`;
  console.log(logItem);

  //checks if path exist before taking next action
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fspromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fspromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.error(err);
  }
};

const logger = (req, res, next) => {
  logEvent(
    `${req.method} \t ${req.headers.origin} \t ${req.url} `,
    "reqLog.txt"
  );
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvent };

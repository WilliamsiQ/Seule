const logEvent = require("./logEvent");
const EventEmitter = require("events");
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

class Emitter extends EventEmitter {}

//initialize object

const myEmitter = new Emitter();

myEmitter.on("log", (msg, fileName) => logEvent(msg, fileName));

//route handlers
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attempted to load hello.html ");
    next();
  },
  (req, res) => {
    res.send("WILLIHOTS");
  }
);

// chaining route handlers middlewares

const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res, next) => {
  console.log("three");
  res.send("finish");
};

app.get("/chain(.html)?", [one, two, three]);
const PORT = process.env.PORT || 3500;

const serveFile = async (filePath, ContentType, response) => {
  try {
    const rawData = await fsPromises.readFile(
      filePath,
      !ContentType.includes("image") ? "utf8" : ""
    ); //caters for utf8 and image
    const data =
      ContentType === "application/json" ? JSON.parse(rawData) : rawData;
    response.writeHead(filePath.includes("404.html") ? 404 : 200, {
      "Content-Type": ContentType,
    });
    response.end(
      ContentType === "application/json" ? JSON.stringify(data) : data
    );
  } catch (err) {
    console.log(err);
    myEmitter.emit("log", `${err.name}: ${err.message}`, "errLog.txt");

    response.statusCode = 500;
    response.end();
  }
};

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  myEmitter.emit("log", `${req.url} \t ${req.method}`, "reqLog.txt");

  const extension = path.extname(req.url);

  let ContentType;

  switch (extension) {
    case ".css":
      ContentType = "text/css";
      break;
    case ".jpg":
      ContentType = "image/jpeg";
      break;
    case ".js":
      ContentType = "text/javascript";
      break;
    case ".png":
      ContentType = "image/png";
      break;
    case ".json":
      ContentType = "application/json";
      break;
    case ".txt":
      ContentType = "text/plain";
      break;
    default:
      ContentType = "text/html";
  }

  let filePath =
    ContentType === "text/html" && req.url === "/"
      ? path.join(__dirname, "views", "index.html")
      : ContentType === "text/html" && req.url.slice(-1) === "/" // if the last character in the request url is "/"
      ? path.join(__dirname, "views", req.url, "index.html") // the req.url represents the subdir
      : ContentType === "text/html"
      ? path.join(__dirname, "views", req.url)
      : path.join(__dirname, req.url);

  if (!extension && req.url.slice(-1) !== "/") filePath += ".html";

  //checks if file exists
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    //serve file
    serveFile(filePath, ContentType, res);
  } else {
    //error or redirect
    switch (path.parse(filePath).base) {
      case "old-page.html":
        res.writeHead(301, { location: "/new-page.html" }); // redirects to new page
        res.end(); // ends response
        break;
      case "www-page.html":
        res.writeHead(301, { location: "/" }); // redirects to new page
        res.end(); // ends response
        break;
      default:
        //serve 404
        serveFile(path.join(__dirname, "views", "404.html"), "text/html", res);
    }
  }
});

server.listen(PORT, () => console.log(`server running on port ${PORT}`));

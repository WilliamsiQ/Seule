const logEvent = require("./logEvent");
const EventEmitter = require("events");
const http = require("http");
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs").promises;

class Emitter extends EventEmitter {}

//initialize object

const myEmitter = new Emitter();

//add listener for the log event

const PORT = process.env.PORT || 3500;

myEmitter.on("log", (msg) => logEvent(msg));

const serveFile = async (filePath, ContentType,response)=>{
    try {
        const data = await fsPromises.readFile(filePath, "utf8");
        response.writeHead(200, {"Content-Type": ContentType})
        response.end(data);
        
    } catch (err) {
        console.log(err)
        response.statusCode = 500;
        response.end();

        
    }
}

const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  const extension = path.extname(req.url);
  
  let ContentType;

  switch(extension) {
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
            : ContentType === "text/html" && req.url.slice(-1) === "/"  // if the last character in the request url is "/"
                ? path.join(__dirname, "views", req.url, "index.html")  // the req.url represents the subdir
                : ContentType === "text/html" 
                    ? path.join(__dirname, "views", req.url) 
                    : path.join(__dirname,  req.url);


    // makes the .htmls extension not required in the url when typed in browser
    if(!extension && req.url.slice(-1) !== "/") filePath += ".html";

    //checks if file exists
    const fileExists = fs.existsSync(filePath);

    if(fileExists) {
        //serve file
        serveFile(filePath,ContentType,res)
    } else {
        //error or redirect
        switch(path.parse(filePath).base) {
            case "old-page.html":
                res.writeHead(301, {"location": "/new-page.html"})  // redirects to new page
                res.end() // ends response
                break;
            case "www-page.html":
                res.writeHead(301, {"location": "/"})  // redirects to new page
                res.end() // ends response
                break;
            default:
                //serve 404
                serveFile(path.join(__dirname,views, "404.html"),"text/html",res)

            
        }
    }



  
  



/* 
  // does sameting as code above
  let filePath;
  
  switch(req.url) {
    case "/":
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html")
        filePath = path.join(__dirname, "views", "index.html")
        fs.readFile(filePath,"utf8", (err,data)=>{
            res.end(data)
        });
        break;
  
};
 // does sameting as code above
const server = http.createServer((req, res) => {
  console.log(req.url, req.method);

  let filePath;
  if(req.url === "/"  || req.url === "index.html") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html")
    filePath = path.join(__dirname, "views", "index.html")
    fs.readFile(filePath,"utf8", (err,data)=>{
        res.end(data)
    })
  }
});

/*
  //emit event
  myEmitter.emit("log", "event emitted");
*/



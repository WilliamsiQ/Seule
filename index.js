




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



  
  

    server.listen(PORT, () => console.log(`server runing at port ${PORT}`));




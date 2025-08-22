const http = require('http')
const fs = require ('fs') //handle file 
const path = require('path') //grab the paths

const port = 3000

const server = http.createServer((request,response)=>{ // listen on the port always runs when server.js works
    const filePath = path.join(__dirname, request.url === '/' ? "index.html" : request.url)
    console.log(filePath);

    const extName = String(path.extname(filePath)).toLowerCase()

    const mimeTypes = { //use for which type of file may be supported
        '.html' : 'text/html',
        '.css' :  'text/css',
        '.js' : 'text/javascript',
        '.png' : 'image/png'
    }

    const contentType = mimeTypes[extName]  || 'application/octet-stream' //generic binary file attachment for mime

    fs.readFile(filePath, (err, content)=> {
        if(err){
            if(err.code === "ENOENT") {//Error NO ENTry or ENTity
            response.writeHead(404,{"content-type" : contentType})
            response.end("404: file not find brooo")
            }
        } else {
            response.writeHead(200, { 'content-type' : contentType})
            response.end(content,"utf-8")
        }
    })
}) 

server.listen(port, ()=> {
    console.log(`server is listening on ${port}`);
})

// __dirname  for current file context in path.join method 

//  ┌───────────────────────┐
//  │   Client (Browser)    │
//  │  Request: / or /file  │
//  └──────────┬────────────┘
//             │
//             ▼
//  ┌───────────────────────┐
//  │   HTTP Server (Node)  │
//  │   request handler     │
//  └──────────┬────────────┘
//             │
//             ▼
//  ┌───────────────────────┐
//  │   Path Resolution     │
//  │ if "/" → index.html   │
//  │ else → requested file │
//  └──────────┬────────────┘
//             │
//             ▼
//  ┌───────────────────────┐
//  │  Determine MIME Type  │
//  │ .html → text/html     │
//  │ .css  → text/css      │
//  │ .js   → text/javascript│
//  │ .png  → image/png     │
//  │ else → application/*  │
//  └──────────┬────────────┘
//             │
//             ▼
//  ┌───────────────────────┐
//  │  fs.readFile(file)    │
//  └──────────┬────────────┘
//       ┌─────┴─────────────┐
//       │                   │
//       ▼                   ▼
// ┌─────────────┐     ┌─────────────────┐
// │   Error     │     │   Success       │
// └─────┬───────┘     └───────┬────────┘
//       │                     │
//       ▼                     ▼
// ┌──────────────┐    ┌────────────────────┐
// │ if ENOENT    │    │  Send 200 OK       │
// │ → 404 NotFound│    │  with file content│
// │ else → 500   │    │  + proper MIME type│
// └──────────────┘    └────────────────────┘

//             ▼
//  ┌───────────────────────┐
//  │   Response sent back  │
//  │   to client browser   │
//  └──────────┬────────────┘
//             │
//             ▼
//  ┌───────────────────────┐
//  │ Browser renders page  │
//  └───────────────────────┘

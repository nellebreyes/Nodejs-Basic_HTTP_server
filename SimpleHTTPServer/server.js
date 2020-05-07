//require modules
const http = require('http');
const path = require('path');
const url = require('url');
const fs = require('fs');

//define a mimeType object
var mimeTypes = {
    "html":"text/html",
    "css" : "text/css",
    "javascript":"text/javascript",
    "jpeg":"image/jpeg",
    "jpg":"image/jpeg",
    "png": "image/png",
    "json":"text/json"
    };

//create http server
http.createServer(function(req,res){
    
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(__dirname,unescape(uri));
    console.log('Loading ' + uri);
    var stats;
    try{
        stats = fs.lstatSync(fileName);
    }catch(e){
        res.writeHead(404,{'Content-type':'text/plain'});
        res.write('404 - File not found');
        res.end();
        return;
    }
    
    if(req.url === '/'){
        res.writeHead(302,{'Location': 'index.html'});
        res.end();
        return;
    //check if request is a file     
    }else if(stats.isFile()){
        var mtype = mimeTypes[path.extname(uri).split(".").reverse()[0]];
        res.writeHead(200,{'Content-Type': 'text/html'});
       //var uri = uri.substr(1);
        
        var fileStream =  fs.createReadStream(__dirname+req.url);
        fileStream.pipe(res);
   //check if request is a directory  
    }else if(stats.isDirectory()){
        //console.log( __filename);
        res.writeHead(302,{'Location':  __filename});
        
       // res.end("test");
        return;
    }else{
        res.writeHead(500,{'Content-type': 'text/plain'});
        res.end('500 Internal error');
        return;
    }
    
}).listen(3000,()=>{
    console.log('Server is live on port 3000.');
})
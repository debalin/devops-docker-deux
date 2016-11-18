var http = require('http');
var execSync = require('child_process').execSync;
var fileIP = 'write';

var server = http.createServer(function (request, response) {
  var child = execSync("curl " + fileIP + ":7000", { encoding: "utf8" });
  response.writeHead(200, { "Content-Type": "text/plain" });
  response.end(child);
});

server.listen(8000);

console.log("Server running at http://127.0.0.1:8000/");
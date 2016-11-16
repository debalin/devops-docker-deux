var http = require('http');
var httpProxy = require('http-proxy');
var redis = require('redis');
var os = require('os');
var client = redis.createClient(6379, 'redis', {});
var args = process.argv.slice(2);
var PORT = 3456;

var options = {};
var proxy = httpProxy.createProxyServer(options);
var webappBaseURL = "http://192.168.33.10:";
var webappBasePort = 3000;
var serversKey = "servers";
var hostname = os.hostname();

client.del(serversKey, function (err, reply) {
  if (err) throw err;
});
client.lpush(serversKey, webappBaseURL + webappBasePort, function (err, reply) {
  if (err) throw err;
});

var proxy_server = http.createServer(function (req, res) {
  client.rpoplpush(serversKey, serversKey, function (err, reply) {
    console.log("Delegating to " + reply + ".");
    proxy.web(req, res, { target: reply });
  });
});

proxy_server.listen(PORT, hostname, function (err, reply) {
  var host = proxy_server.address().address;
  var port = proxy_server.address().port;
  hostnameURL = "http://" + host + ":";
  mainServerURL = "http://" + host + ":" + port;
  console.log('Main app listening at ' + mainServerURL);
});
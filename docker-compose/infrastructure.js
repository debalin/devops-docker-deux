var redis = require('redis');
var execSync = require('child_process').execSync;

var client = redis.createClient(6379, '192.168.33.10', {});
var tempServersKey = "tempServers";
var serversKey = "servers";

setInterval(function() {
  client.lrange(tempServersKey, 0, -1, function (err, reply) {
    if (err) throw err;
    for (var server of reply) {
      console.log("Server: " + server);
      var temp = server.split(":");
      var dockerImage = "webapp_" + temp[2];
      var dockerContainer = dockerImage + "_app";
      var child = execSync("bash ./spawn_docker.sh " + dockerImage + " " + temp[2] + " " + dockerContainer);
      client.lpush(serversKey, server, function (err, reply) {
        console.log("Pushed server to servers list.");
        if (err) throw err;
      });
    }
    client.del(tempServersKey, function (err, reply) {      
      if (err) throw err;
    })
  });
}, 90);
var redis = require('redis');
var multer = require('multer');
var express = require('express');
var fs = require('fs');
var os = require('os');
var request = require('request');
var app = express();

var count = 0;
var hostname = os.hostname();
var recentKey = "recent";
var imageKey = "images";
var serversKey = "servers";
var tempServersKey = "tempServers";
var deleteServersKey = "deleteServers";
var hostnameURL = "";
var mainServerURL = "";
var PORT = process.env.start_port;
var vmIP = "192.168.33.10";
var client = redis.createClient(6379, vmIP, {});
var webappBaseURL = "http://" + vmIP + ":";

app.use(function (req, res, next) {
  //http://stackoverflow.com/questions/10183291/how-to-get-the-full-url-in-express
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  client.lpush(recentKey, url, function (err, reply) {
    if (err) throw err;
    client.ltrim(recentKey, 0, 4, function (err, reply) {
      if (err) throw err;
      next();
    });
  });
});

app.get('/recent', function (req, res) {
  client.lrange(recentKey, 0, -1, function (err, reply) {
    var replyMessage = "<p>Most recent 5 URLs visited are:<br/><br/>";
    for (var site of reply) {
      replyMessage += site + "<br/>";
    }
    replyMessage += "</p>";
    res.send(replyMessage);
  });
});

app.post('/upload', [multer({ dest: './uploads/' }), function (req, res) {
  if (req.files.image) {
    fs.readFile(req.files.image.path, function (err, data) {
      if (err) throw err;
      var img = new Buffer(data).toString('base64');
      client.lpush(imageKey, img, function (err, reply) {
        if (err) throw err;
        res.send("Uploaded.");
      });
    });
  }
}]);

app.get('/meow', function (req, res) {
  client.lpop(imageKey, function (err, reply) {
    if (err) throw err;
    if (reply) {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.write("<h1>\n<img src='data:my_pic.jpg;base64," + reply + "'/>");
      res.end();
    }
    else {
      res.send("<p>No pictures to show. Use /upload more.</p>");
    }
  });
});

app.get('/set/:key', function (req, res) {
  var value = "This message will self-destruct in 10 seconds.";
  client.set(req.params.key, value, function (err, reply) {
    client.expire(req.params.key, 10);
    res.send("<p>SET operation.<br/><br/>Key: " + req.params.key + "<br/>Value: " + value + "</p>");
  });
});

app.get('/get/:key', function (req, res) {
  client.get(req.params.key, function (err, reply) {
    if (err) throw err;
    res.send("<p>GET operation.<br/><br/>Key: " + req.params.key + "<br/>Value: " + reply + "</p>");
  });
});

app.get('/spawn', function (req, res) {
  client.lrange(serversKey, 0, -1, function (err, reply) {
    if (err) throw err;
    var maxPort = 3000;
    for (var server of reply) {
      var temp = server.split(":");
      var port = parseInt(temp[2]);
      if (port > maxPort)
        maxPort = port;
    }
    maxPort++;
    client.lpush(tempServersKey, webappBaseURL + maxPort, function (err, reply) {
      if (err) throw err;
      res.send(webappBaseURL + maxPort + " spawned.");
    })
  });
});

app.get('/listservers', function (req, res) {
  client.lrange(serversKey, 0, -1, function (err, reply1) {
    var replyMessage = "<p>Servers spawned are:<br/>";
    for (var server of reply1) {
      replyMessage += server + "<br/>";
    }
    res.send(replyMessage);
  });
});

app.get('/destroy', function (req, res) {
  client.llen(serversKey, function (err, reply) {
    if (err) throw err;
    serversCount = parseInt(reply);
    if (serversCount == 0) {
      res.send("<p>Nothing to destroy.</p>");
    }
    else {
      var randomServerIndex = getRandomIntInclusive(0, serversCount - 2);
      client.lindex(serversKey, randomServerIndex, function (err, reply1) {
        if (err) throw err;
        client.lpush(deleteServersKey, reply1, function (err, reply2) {
          res.send("<p>Server at " + reply1 + " destroyed.");
        });
      });
    }
  });
});

//HTTP server
var server = app.listen(PORT, hostname, function () {
  var host = server.address().address;
  var port = server.address().port;
  hostnameURL = "http://" + host + ":";
  mainServerURL = "http://" + host + ":" + port;
  console.log('Main app listening at ' + mainServerURL);
});

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

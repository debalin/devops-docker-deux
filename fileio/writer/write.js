var fs = require("fs");
var exec = require('child_process').exec;

var filename = "random";

fs.writeFileSync(filename, "Random letters: ");
var command = "socat TCP-LISTEN:7000,fork,reuseaddr,crlf OPEN:" + filename + ",rdonly";
exec(command, { encoding: 'utf8' }, function (error, stdount, stderr) {
  console.log(child);
});

setInterval(function () {
  fs.appendFileSync(filename, makeid());
}, 120);

// http://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 1; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
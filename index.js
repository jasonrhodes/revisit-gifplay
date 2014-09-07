var fs = require("fs");
var nconf = require("nconf");
var fs = require("fs");
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer');
var express = require('express');

var app = express();
nconf.argv().env().file({ file: __dirname + '/local.json' });

// Set up some Express settings
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(__dirname + '/public'));

function makeDataUri(type, buffer) {
  return 'data:' + type + ';base64,' + buffer.toString('base64');
}

function imgTag(image) {
  return "<img src='" + makeDataUri("image/gif", image) + "' />";
}


/**
 * Add services to expose here, which should each
 * export a function that takes an image buffer and
 * a callback that will be passed the modified
 * image buffer, usually a writegif cb
 *
 */
var methods = {
  pingpong: require("./lib/pingpongGif"),
  shuffle: require("./lib/shuffleGif"),
  slowmo: require("./lib/slowmoGif"),
  bouncy: require("./lib/bouncy"),
  reverse: require("./lib/reverse")
};


/**
 * Create necessary endpoints for each registered service
 *
 *
 */
Object.keys(methods).forEach(function (name) {

  var fn = methods[name];
  var rootPath = "/" + name;
  var examplePath = rootPath + "/example/:file";
  var servicePath = rootPath + "/service";

  var methodTitle = "GIF PLAY // " + name.toUpperCase();

  app.get(rootPath, function (req, res) {
    res.send(methodTitle);
  });

  app.get(examplePath, function (req, res) {

    fs.readFile("./gifs/" + req.params.file, function (err, buffer) {

      if (err) {
        res.send(err);
        return;
      }

      fn(buffer, function (err, image) {
        res.send("<h1>" + methodTitle + " EXAMPLE</h1>" + imgTag(image));
      });

    });

  });

  app.post(servicePath, function (req, res) {

    var buffer = dataUriToBuffer(req.body.content.data);

    if (buffer.type !== 'image/gif') {
      return res.json(req.body);
    }

    fn(buffer, function (err, image) {

      req.body.content.data = makeDataUri(buffer.type, image);
      req.body.content.type = buffer.type;
      res.json(req.body);

    });

  });

});

var port = nconf.get("port") || 8000;
app.listen(port);
console.log("GIFPLAY app listening on port " + port);

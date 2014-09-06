var fs = require("fs");
var nconf = require("nconf");
var fs = require("fs");
var bodyParser = require('body-parser');
var dataUriToBuffer = require('data-uri-to-buffer');
var express = require('express');

var app = express();
nconf.argv().env().file({ file: '../local.json'});

// Set up some Express settings
app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(root + '/public'));

function makeDataUri(type, buffer) {
  return 'data:' + type + ';base64,' + buffer.toString('base64');
}


/**
 * Add services to expose here, which should each
 * export a function that takes and returns an image
 * buffer, obviously returning the modified buffer
 *
 */
var services = {
  pingpong: require("./lib/pingpongGif"),
  shuffle: require("./lib/shuffleGif")
};


/**
 * Create necessary endpoints for each registered service
 *
 */
Object.keys(services).forEach(function (name) {

  var fn = services[name];
  var rootPath = "/" + name;
  var servicePath = root + "/service";

  app.get(rootPath, function (req, res) {
    res.send("GIF PLAY // " + name.toUpperCase());
  });

  app.post(servicePath, function (req, res) {

    var buffer = dataUriToBuffer(req.body.content.data);

    if (buffer.type !== 'image/gif') {
      return res.json(req.body);
    }

    fn(buffer, function (err, transformed) {

      req.body.content.data = makeDataUri(buffer.type, transformed);
      req.body.content.type = buffer.type;
      res.json(req.body);

    });

  });

});

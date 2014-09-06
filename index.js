var nconf = require("nconf");
var fs = require("fs");
var bodyParser = require('body-parser')
var dataUriToBuffer = require('data-uri-to-buffer')
var express = require('express')
var app = express()
var shuffle = require("./lib/shuffleGif");
var pingpong = require("./lib/pingpongGif");

nconf.argv().env().file({ file: 'local.json'});

function makeDataUri(type, buffer) {
  return 'data:' + type + ';base64,' + buffer.toString('base64');
}

function imgTag(image) {
  return "<img src='" + makeDataUri("image/gif", image) + "' />";
}


/**
 * This is your custom transform function
 * move it wherever, call it whatever
 */
// var transform = require("./transformer")

// Set up some Express settings
app.use(bodyParser.json({ limit: '1mb' }))
app.use(express.static(__dirname + '/public'))

/**
 * Home route serves index.html file, and
 * responds with 200 by default for revisit
 */
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})


/**
 * Shuffle Service
 */

app.get('/shuffle', function (req, res) {
  res.status(200).end();
});


app.get('/shuffle/service', function(req, res) {

  var buffer = dataUriToBuffer(req.body.content.data);

  if (buffer.type !== 'image/gif') {
    return res.json(req.body);
  }

  shuffle(buffer, function (err, shuffled) {

    req.body.content.data = makeDataUri(buffer.type, shuffled);
    req.body.content.type = buffer.type;
    res.json(req.body);

  });

});


/**
 * Ping Pong Service
 */

app.get('/pingpoing', function (req, res) {
  res.status(200).end();
});

app.post('/pingpong/service', function(req, res) {

  var buffer = dataUriToBuffer(req.body.content.data);

  if (buffer.type !== 'image/gif') {
    return res.json(req.body);
  }

  pingpong(buffer, function (err, shuffled) {

    req.body.content.data = makeDataUri(buffer.type, shuffled);
    req.body.content.type = buffer.type;
    res.json(req.body);

  });

});


/**
 * Test Routes
 *
 */

app.get('/test/shuffle/:name', function (req, res) {

  fs.readFile("./gifs/" + req.params.name, function (err, buffer) {

    shuffle(buffer, function (err, image) {
      res.send(imgTag(image));
    });

  });

});

app.get('/test/pingpong/:name', function (req, res) {

  fs.readFile('./gifs/' + req.params.name, function (err, buffer) {

    pingpong(buffer, function (err, image) {
      res.send(imgTag(image));
    });

  });

});

var port = nconf.get("port");
app.listen(port);
console.log('server running on port: ', port);

var readimage = require("readimage");
var writegif = require("writegif");

function pingPong(imageBuffer, callback) {

  readimage(imageBuffer, function (err, image) {

    if (err) {
      console.log("failed to parse the image");
      console.log(err);
      return;
    }

    var reverse = image.frames.slice();
    reverse.reverse();
    image.frames = image.frames.concat(reverse);

    writegif(image, callback);

  });

}

module.exports = pingPong;

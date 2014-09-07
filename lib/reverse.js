var readimage = require("readimage");
var writegif = require("writegif");

function reverse(imageBuffer, callback) {

  readimage(imageBuffer, function (err, image) {

    if (err) {
      console.log("failed to parse the image");
      console.log(err);
      return;
    }

    image.frames.reverse();

    writegif(image, callback);

  });

}

module.exports = reverse;

var readimage = require("readimage");
var writegif = require("writegif");

function bouncy(imageBuffer, callback) {

  readimage(imageBuffer, function (err, image) {

    if (err) {
      console.log("failed to parse the image");
      console.log(err);
      return;
    }

    var bounced = [];

    for (var i = 0; i < image.frames.length; i++) {
      bounced.push(image.frames[i]);
      if (i > 0 && i < (image.frames.length - 1)) {
        bounced.push(image.frames[0]);
      }
    }

    image.frames = bounced;

    writegif(image, callback);

  });

}

module.exports = bouncy;

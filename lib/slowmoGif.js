var readimage = require("readimage");
var writegif = require("writegif");

function slowmo(imageBuffer, callback) {

  readimage(imageBuffer, function (err, image) {

    if (err) {
      console.log("failed to parse the image");
      console.log(err);
      return;
    }

    image.frames = image.frames.map(function (frame, i) {
      if ((i + 1) % 3 === 0) {
        frame.delay = 250;
      }
      return frame;
    });

    writegif(image, callback);

  });

}

module.exports = slowmo;

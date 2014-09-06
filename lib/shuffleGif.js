var readimage = require("readimage");
var writegif = require("writegif");

function shuffle(o){ //v1.0
  for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
  return o;
};

function shuffleGif(imageBuffer, callback) {

  readimage(imageBuffer, function (err, image) {

    if (err) {
      console.log("failed to parse the image");
      console.log(err);
      return;
    }

    // Double the frames pre-shuffle
    var frames = image.frames;
    image.frames = image.frames.concat(frames);

    image.frames = shuffle(image.frames);

    writegif(image, callback);

  });

}

module.exports = shuffleGif;

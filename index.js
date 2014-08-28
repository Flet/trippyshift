var gm = require('gm'),
  temp = require('temp'),
  fs = require('fs');

function randomIntInc(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

module.exports = function (options, buffer, callback) {

  if (!callback && typeof buffer === 'function') {
    callback = buffer;
    buffer = options;
    options = {};
  }

  var shiftXMaxPercent = options.shiftXMaxPercent || 1,
    shiftYMaxPercent = options.shiftYMaxPercent || 1;

  gm(buffer).identify(function (err, data) {
    if (err) {
      callback(err);
    }

    var imgWidth = data.size.width,
      imgHeight = data.size.height,
      shiftX = randomIntInc(0, imgHeight * shiftXMaxPercent),
      shiftY = randomIntInc(0, imgWidth * shiftYMaxPercent),
      tempImgRoll = temp.path({
        suffix: '.' + data.format
      }),
      tempImg = temp.path({
        suffix: '.' + data.format
      });

    //TODO: uhh, how about some async
    gm(buffer)
      .write(tempImg, function () {
        gm(buffer)
          .roll(shiftX, shiftY)
          .write(tempImgRoll, function () {
            gm()
              .in('-page', '+0+0')
              .in(tempImgRoll)
              .in('-page', '+' + 0 + '+' + 0)
              .compose('Add')
              .in(tempImg)
              .flatten()
              .toBuffer(function (err, buff) {
                fs.unlinkSync(tempImg);
                if (err) callback(err);
                gm(buff).setFormat(data.format)
                  .toBuffer(function (err, buffy) {
                    if (err) callback(err);
                    callback(null, buffy);
                  });
              });
          });
      });
  });
};
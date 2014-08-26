trippyshift
===========

This module takes a buffer holding an image and uses graphicsmagick to overlay an offset second copy of the image while applying the "Add" composite operator.

install:
```
npm install trippyshift --save
```

usage:
```
var fs = require('fs'),
    trippyshift = require('trippyshift');


var wooo;
fs.readFile('./file.jpg', function (err, data) {
    wooo = data;
    trippyshift({}, data, writeToDestination);
});

function writeToDestination(err, trippedOutBuf) {
    if (err) throw err;
    fs.writeFileSync('./output.jpg', trippedOutBuf);
};
```

an `options` object with `shiftXMaxPercent` and/or shiftYMaxPercent can be passed in optionally as the first argument.
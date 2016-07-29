WebJackPort
====

...is a wrapper for [WebJack](https://github.com/publiclab/webjack) to use as transport layer for [firmata.js](https://github.com/firmata/firmata.js). WebJackPort is inspired by [EtherPort](https://github.com/rwaldron/etherport) from Rick Waldron.

Try it out in this live demo: https://publiclab.github.io/webjack-firmata/examples/

## Install
```
npm install --save webjackport
```


## Use
```js
var Firmata = require("firmata").Board;
var WebJackPort = require("webjackport");
var board = new Firmata(new WebJackPort());

board.on("ready", function() {
  console.log("READY!");
  console.log(
    board.firmware.name + "-" +
    board.firmware.version.major + "." +
    board.firmware.version.minor
  );

  var state = 1;

  this.pinMode(13, this.MODES.OUTPUT);

  setInterval(function() {
    this.digitalWrite(13, (state ^= 1));
  }.bind(this), 500);
});
```




## Building

webjackport.js is built using a Grunt task from the source files in `/src/`, and the compiled file is saved to `/dist/webjackport.js`. To build, run `grunt build`. To watch files for changes, and build whenever they occur, run `grunt`. 

## Building the demo

The demo is bundled with [webpack](https://webpack.github.io/). Before executing `webpack`, do `npm install`.
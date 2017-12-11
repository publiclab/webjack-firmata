WebJack-Firmata
====

...is a wrapper for [WebJack](https://github.com/publiclab/webjack) to use as transport layer for [firmata.js](https://github.com/firmata/firmata.js). WebJackPort is inspired by [EtherPort](https://github.com/rwaldron/etherport) from Rick Waldron.

## Live Demos

Try it out here: https://publiclab.github.io/webjack-firmata/example/

__Keyboard Bindings__

A second example, showing triggering of Arduino pins via keyboard keypresses, is available at https://publiclab.github.io/webjack-firmata/example/keyboard/

Find build instructions for the demo at the end of this page.

__Serial communication__

A third example implements serial communication via firmata's `serialWrite`, but depends on StandardFirmataPlus.ino, which has [not yet been ported over to be WebJack compatible](https://github.com/publiclab/webjack-firmata/issues/19). This could allow webjack-firmata to act as a serial bridge.


## Install

To install on your Arduino, see "Sketches" below.

To install on the browser side, you can use NPM:

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
Also take a look at the demo site in the example folder.

### Sketches

Three example sketches are provided:

- SimpleDigitalFirmata
- ConfigurableFirmata
- StandardFirmataWebJack

__SimpleDigitalFirmata__ and __ConfigurableFirmata__ are capable of setting and reading digital pins. The first one is implemented with the standard Firmata library, the latter with ConfigureableFirmata.

__StandardFirmataWebJack__ is a modification of the standard Firmata firmware and thus has all its capabilities. Additionally a custom SysEx command is implemented, that reports exactly one analog reading.

All sketches are configured with a 10 millisecond delay in the processing loop. This is due to [crosstalk](https://en.wikipedia.org/wiki/Crosstalk) from requests messages. An immediate reply will make it difficult for WebJack to distinguish the crosstalk from the actual reply. 

### Arduino Create

You can use these sketches in the online Arduino editor at:

* [SimpleDigitalFirmata](https://create.arduino.cc/editor/jywarren/62d3f94c-a682-4b51-aea5-d0ae54e360b6/preview)

****

### Known Issues

Currently, it is required to create the board with additional options:

```js
var opts = {
  reportVersionTimeout: 2500,  // increase if no sound is played after loading the site
  skipCapabilities: true  // we skip this for now, reception via WebJack is not reliable enough
};
var board = new Board(new WebJackPort(), opts);
```

Audio cables may introduce crosstalk that can lead to reception of sent data. As a result of that, firmata can have difficulties to decode answers correctly. It can help to assign empty handler functions to SysEx requests as workaround:

```js
board.sysexResponse(CAPABILITY_QUERY, function (data){});
``` 


##Developers

Help improve Public Lab software!

* Join the 'plots-dev@googlegroups.com' discussion list to get involved
* Find lots of info on contributing at http://publiclab.org/wiki/developers
* Review specific contributor guidelines at http://publiclab.org/wiki/contributing-to-public-lab-software


### Building

webjackport.js is built using a Grunt task from the source files in `/src/`, and the compiled file is saved to `/dist/webjackport.js`. To build, run `grunt build`. To watch files for changes, and build whenever they occur, run `grunt`. 

### Building the demo

The demos in `/example/` are bundled with [Webpack](https://webpack.github.io/). Before executing `webpack`, do `npm install` -- and `cd example` -- since you have to run `webpack` from inside the `example` directory. The code in `/example/bundle.js`, is then compiled from `/example/Demo.js`. 


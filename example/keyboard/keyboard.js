var digitalKeys, 
    keyboard, 
    board;

$(document).ready(function($) {

  // Possible firmata commands at https://github.com/firmata/firmata.js

  // https://www.npmjs.com/package/keyboard-cjs
  keyboard = new Keyboard(window);
  board = Demo.board; // exported from /examples/Demo.js; set in /examples/webpack.config.js

  // associate keypresses with writes to digital pins
  digitalKeys = {
    'A': 0,
    'S': 1,
    'W': 2,
    'D': 3,
    'Left':  0,
    'Down':  1,
    'Up':    2,
    'Right': 3
  }

  // associate keypresses with writes to analog pins
  // unused as of now:
  var analogKeys = {};

  // listen on analog pin 4
  analogRead(4, function(value) {
    // do something with the returned value
    console.log(value);
  });

  readKeys(); // read key mappings in

  // for debugging:

  $('.test').on('mousedown', function() {
    digitalWrite(2, 1); 
    digitalWrite(15, 1); 
  }).on('mouseup', function() {
    digitalWrite(2, 0); 
    digitalWrite(15, 0); 
  });

});


// to add new keys at runtime:
// bindKey('Up', 1);



/* ======== make changes above this line ========= */

// actually connect up the key to the pin
function bindKey(key, pin) {

    keyboard.on(key, 'activate', function() {

      digitalWrite(pin, 1); 

    });

    // on key unpress, reset to 0
    keyboard.on(key, 'release', function() {

      digitalWrite(pin, 0); 

    });
}

function readKeys(dKeys) {

  dKeys = dKeys || digitalKeys;

  // go through each key from above
  Object.keys(dKeys).forEach(function(key, i) {

    bindKey(key, dKeys[i]);

  });

}

// write a state to a pin
function digitalWrite(pin, state) {
  var level = state == '0' ? board.LOW : board.HIGH;
  if (board.isReady){
    console.log("digitalWrite("+pin+","+level+")");
    board.pinMode(pin, board.MODES.OUTPUT);
    board.digitalWrite(pin, level);
  } else {
    console.log("Board not ready. Pin "+pin+", level "+level+".");
  }
}


// listen on an analog pin and run function callback(value) when things happen
function analogRead(pin, callback) {
  if (board.isReady){
    console.log("analogRead("+pin+")");
    board.setSamplingInterval(200);
    board.analogRead(pin, function(value){
      console.log("Received analog value: "+ value);
      log.appends("Analog Pin " + pin + ": " + value);
    });
  }
}

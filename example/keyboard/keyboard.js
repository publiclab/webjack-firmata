(function() {

  // Possible firmata commands at https://github.com/firmata/firmata.js

  // https://www.npmjs.com/package/keyboard-cjs
  var keyboard = new Keyboard(window),
      board = Demo.board; // exported from /examples/Demo.js; set in /examples/webpack.config.js

  // associate keypresses with writes to digital pins
  var digitalKeys = {
    'A': 0,
    'S': 1,
    'W': 2,
    'D': 3
  }

  // associate keypresses with writes to analog pins
  // unused as of now:
  var analogKeys = {};

  // listen on analog pin 4
  analogRead(4, function(value) {
    // do something with the returned value
    console.log(value);
  });




  /* ======== make changes above this line ========= */


  // go through each key from above
  Object.keys(digitalKeys).forEach(function(key, i) {

    // actually connect up the key to the pin
    keyboard.on(key, 'activate', function() {

      var pin = digitalKeys[key];

      digitalWrite(pin, 1); 

    });

    // same for key unpress, reset to 0
    keyboard.on(key, 'release', function() {

      var pin = digitalKeys[key];

      digitalWrite(pin, 0); 

    });

  });

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

})();

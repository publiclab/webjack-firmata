(function() {

  // https://www.npmjs.com/package/keyboard-cjs
  var keyboard = new Keyboard(window);

  // associate keypresses with writes to digital pins
  var digitalKeys = {
    'a': 0,
    's': 1,
    'w': 2,
    'd': 3
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
    _client.keyboard.on(key, function() { digitalWrite(keys[i]); });

  });

  // write a state to a pin
  function digitalWrite(pin, state) {
    if (board.isReady){
      var level = state == '0' ? board.LOW : board.HIGH;
      console.log("digitalWrite("+pin+","+level+")");
      board.pinMode(pin, board.MODES.OUTPUT);
      board.digitalWrite(pin, level);
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

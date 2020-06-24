'use strict';

var Firmata = require("firmata");
var Board = Firmata.Board;
var WebJackPort = require("../dist/webjackport");
var opts = {
  reportVersionTimeout: 2500,
  skipCapabilities: true  // we skip this for now, capabilities are not decoded correctly yet
};
var board = new Board(new WebJackPort(), opts);

var CAPABILITY_QUERY     = 0x6B;
var ANALOG_MAPPING_QUERY = 0x69;
var SAMPLING_INTERVAL    = 0x7A;

function setOptions(options) {
  board = new Board(new WebJackPort(options), opts);
}

$(document).ready(function($) {
  var log = $('.webjack-log');
  log.appends = function(text){
    this.append(text + "<br>");
    this.scrollTop(this[0].scrollHeight);  // autoscrolling
  }

  // workaround to suppress data from crosstalk
  board.sysexResponse(CAPABILITY_QUERY, function (data){});
  board.sysexResponse(ANALOG_MAPPING_QUERY, function (data){});
  board.sysexResponse(SAMPLING_INTERVAL, function (data){});
  // --------------------------------------

  function printFirmware(){
    var firmware = board.firmware.name + "-" +
      board.firmware.version.major + "." +
      board.firmware.version.minor;
    console.log(firmware);
    log.appends("Firmware: " + firmware);
  }

  // setup buttons
  var digitalButton = $('#digital')[0];
  var analogButton = $('#analog')[0];
  digitalButton.disabled = true;
  analogButton.disabled = true;


  board.on("ready", function() {
    printFirmware();    
    log.appends("READY! Press 'Query Capabilities' to enable analogRead.");
    digitalButton.disabled = false;

    board.queryAnalogMapping(function (mapping){
      analogButton.disabled = false;
    });
    // var state = 1;
    // this.pinMode(13, this.MODES.OUTPUT);
    // setInterval(function() {
    //   this.digitalWrite(13, (state ^= 1));
    // }.bind(this), 500);
  });


  $('#capab').click(function () {
    board.queryCapabilities(function (){
      log.appends("Received capabilities.");
      board.queryAnalogMapping(function (mapping){
        log.appends("Received analog mapping. Ready to read.");
        analogButton.disabled = false;
      });
    });
  });
  
  $('#firmware').click(function () {
    board.queryFirmware(function (){
      printFirmware();
    });
  });
  
  digitalButton.onclick = function () {
    if (board.isReady){
      var pin = $('#pin').val();
      var level = $('#state').val() == '0' ? board.LOW : board.HIGH;
      console.log("digitalWrite("+pin+","+level+")");
      board.pinMode(pin, board.MODES.OUTPUT);
      board.digitalWrite(pin, level);
    }
  }
  

  // var CUSTOM_READ_ANALOG = 0x07;  // custom sysex command to read an analog pin only once
  analogButton.onclick = function () {
    if (board.isReady){
      var pin = $('#apin').val();
      console.log("analogRead("+pin+")");
      board.setSamplingInterval(200);
      board.analogRead(pin, function(value){
        console.log("Received analog value: "+ value);
        log.appends("Analog Pin " + pin + ": " + value);
      });

      // board.addListener("analog-read-" + pin, function(value){
      //   console.log("Received analog value: "+ value);
      //   log.appends("Analog Pin " + pin + ": " + value);
      //   board.removeAllListeners("analog-read-" + pin);
      // });
      // board.sysexCommand(Board.encode([CUSTOM_READ_ANALOG, pin]));
    }
  }

  $('#reset').click(function () {
    board.reset();
  });
});

module.exports = {
  board: board,
  setOptions: setOptions
};


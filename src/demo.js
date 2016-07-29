'use strict';

var $ = require("jquery");

$(document).ready(function($) {
  var Firmata = require("firmata").Board;
  var WebJackPort = require("../dist/webjackport");
  var board = new Firmata(new WebJackPort());


  var log = $('.webjack-log');

  board.on("ready", function() {
    console.log("READY!");
    var firmware = board.firmware.name + "-" +
      board.firmware.version.major + "." +
      board.firmware.version.minor;
    console.log(firmware);
    log.append("READY!<br>" + firmware + "<br>");

    // var state = 1;
    // this.pinMode(13, this.MODES.OUTPUT);
    // setInterval(function() {
    //   this.digitalWrite(13, (state ^= 1));
    // }.bind(this), 500);

  });


  $('#capab').click(function () {
    board.queryCapabilities(function (capabilites){
      log.append("Capabilities:<br>");
      log.append(capabilites);
    });
  });
  
  $('#firmware').click(function () {
    board.queryFirmware(function (fmw){
      log.append("Firmware:<br>");
      log.append(fmw);
    });
  });
  
  $('#digital').click(function () {
    if (board.isReady){
      var pin = $('#pin').val();
      var level = $('#state').val();
      console.log("digitalWrite("+pin+","+level+")");
      board.pinMode(pin, board.MODES.OUTPUT);
      board.digitalWrite(pin, level);
    }
  });
  
  $('#analog').click(function () {
    if (board.isReady){
      var pin = $('#apin').val();
      console.log("analogRead("+pin+")");
      board.analogRead(pin, function(value){
        console.log("Received analog value: "+ value);
        log.append("Analog Pin " + pin + ": " + value + "<br>");
      });
  }
  });
});



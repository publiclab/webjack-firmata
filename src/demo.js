'use strict';

$(document).ready(function($) {
  var Firmata = require("firmata").Board;
  var WebJackPort = require("../dist/webjackport");
  var opts = {
    reportVersionTimeout: 500,
    skipCapabilities: true  // we skip this for now, capabilities are not decoded correctly yet
  };
  window.board = new Firmata(new WebJackPort(), opts);

  var log = $('.webjack-log');
  log.appends = function(text){
    this.append(text + "<br>");
    this.scrollTop(this[0].scrollHeight);
  }

  board.on("ready", function() {
    console.log("READY!");
    var firmware = board.firmware.name + "-" +
      board.firmware.version.major + "." +
      board.firmware.version.minor;
    console.log(firmware);
    log.appends("Board is ready!");
    log.appends("Firmware: " + firmware);

    // var state = 1;
    // this.pinMode(13, this.MODES.OUTPUT);
    // setInterval(function() {
    //   this.digitalWrite(13, (state ^= 1));
    // }.bind(this), 500);

  });


  $('#capab').click(function () {
    board.queryCapabilities(function (capabilites){
      log.appends("Capabilities:");
      log.appends(capabilites);
    });
  });
  
  $('#firmware').click(function () {
    board.queryFirmware(function (fmw){
      log.appends("Firmware:");
      log.appends(fmw);
    });
  });
  
  $('#digital').click(function () {
    if (board.isReady){
      var pin = $('#pin').val();
      var level = $('#state').val() == '0' ? board.LOW : board.HIGH;
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
        log.appends("Analog Pin " + pin + ": " + value);
      });
  }
  });
});



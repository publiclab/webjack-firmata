$(document).ready(function() {

  Demo.board.serialConfig({
    portId: Demo.board.SERIAL_PORT_IDs.HW_SERIAL0,
    baud: 115200
    // rxPin {number} 
    //  [SW Serial only] The RX pin of the SoftwareSerial instance
    // txPin {number} 
    //  [SW Serial only] The TX pin of the SoftwareSerial instance
  });

  $('.serialWriteSend').click(serialWrite);
  $('.serial').submit(serialWrite);

  function serialWrite(e) {

    var text = $('.serialWrite').val();

    console.log('SerialWrite: ' + text);
    Demo.board.serialWrite(0, text); // port, bytesIn

    return false;

  }

});

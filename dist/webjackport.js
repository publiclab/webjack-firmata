/**
 * Global Environment Dependencies
 */
/* jshint -W079 */
if (!Object.assign || !Map) {
  require("es6-shim");
}

var WebJack = require("webjack");
var Emitter = require("events").EventEmitter;
var priv = new Map();

function WebJackPort() {
  Emitter.call(this);


  // Alias used in state.flushTo
  var WebJackPort = this;

  this.name = "WebJackPort";

  var state = {
    queue: [],
    socket: null,
    flushTo: function(socket) {
      if (this.socket === null) {
        this.socket = socket;
        WebJackPort.emit("open");
      }
      if (this.queue.length) {
        this.queue.forEach(function(buffer) {
          this.socket.write(buffer);
        }, this);

        this.queue.length = 0;
      }
    }
  };

  var connection = new WebJack.Connection({raw : true});
  state.flushTo(connection);

  connection.listen(function(data) {
    // console.log((data[0]).toString(16));
  	WebJackPort.emit("data", data)
  });

  priv.set(this, state);
}

WebJackPort.prototype = Object.create(Emitter.prototype, {
  constructor: {
    value: WebJackPort
  }
});

WebJackPort.prototype.write = function(buffer) {
  var state = priv.get(this);

  if (state.socket === null)
    state.queue.push(buffer);
  else 
    state.socket.send(buffer);
};

module.exports = WebJackPort;


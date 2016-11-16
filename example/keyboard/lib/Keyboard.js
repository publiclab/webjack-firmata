/*
 * Keyboard: Makes the keyboard into a first class citizen.
 *
 * Copyright (c) 2012 Brandon Benvie <http://bbenvie.com>
 * Released under MIT license.
 *
 * Version: 0.0.3
 */

;(function(keyCodes){
  if ('Keyboard' in window) {
    if (typeof module != 'undefined' && module && module.exports) {
      module.exports = window.Keyboard;
    }
    return;
  }
  var keyNames = {};

  for (var i=0; i < 255; i++) {
    if (keyCodes[i].length) {
      keyNames[keyCodes[i]] = i;
    }
  }

  var shiftNumpad = {
    12: 101,
    13: 108,
    33: 105,
    34:  99,
    35:  97,
    36: 103,
    37: 100,
    38: 104,
    39: 102,
    40:  98,
    45:  96,
  };

  var left = {
    16: 160,
    17: 162,
    18: 164

  };
  var right = {
    16: 161,
    17: 163,
    18: 165
  };


  function whatKey(evt){
    var key = keyCodes[evt.keyCode];
    evt.shift = evt.shiftKey;
    if (key) {
      if (evt.keyLocation === 3) {
        var mapped = shiftNumpad[evt.keyCode];
        if (mapped) {
          evt.shift = evt.shiftKey && evt.keyCode !== 13;
          return keyCodes[mapped];
        }
      } else if (evt.keyLocation === 1 && evt.keyCode in left) {
        key = keyCodes[left[evt.keyCode]];
      } else if (evt.keyLocation === 2 && evt.keyCode in right) {
        key = keyCodes[right[evt.keyCode]];
      }
      return key;
    } else if (evt.keyIdentifier) {
      return evt.keyIdentifier;
    } else {
      return String.fromCharCode(evt.keyCode);
    }
  }

  function Keyboard(view){
    var self = this;
    this.keys = {};
    this.view = view;
    this.ctrl = false;
    this.shift = false;
    this.alt = false;
    this.meta = false;

    var down = Object.create(null);

    view.addEventListener('keydown', function(e){
      e.name = whatKey(e);
      self.update(e);
      if (down[e.name]) {
        e.action = 'repeat';
        self.emit(e);
      } else {
        e.action = 'activate';
        down[e.name] = true;
        self.lastKey = e.name;
        self.emit(e);
      }
    }, true);
    view.addEventListener('keyup', function(e){
      e.action = 'release';
      self.lastKey = e.name = whatKey(e);
      self.update(e);
      self.emit(e);
      down[e.name] = null;
    }, true);
    view.addEventListener('keypress', function(e){
      self.update(e);
      e.action = 'press';
      self.lastKey = e.name = String.fromCharCode(e.keyCode);
      self.emit(e);
    }, true);
  }

  Keyboard.LOCATION = {
    STANDARD : 0,
    LEFT     : 1,
    RIGHT    : 2,
    NUMPAD   : 3,
    MOBILE   : 4,
    JOYSTICK : 5
  };

  Keyboard.keyCodes = keyCodes;
  Keyboard.keyNames = keyNames;

  Keyboard.prototype = {
    constructor: Keyboard,
    update: function update(evt){
      this.lastEvent = evt;
      this.ctrl = evt.ctrlKey;
      this.shift = evt.shift || evt.shiftKey;
      this.alt = evt.altKey;
      this.meta = evt.metaKey;
      this.altgr = evt.altGraphKey;
    },
    emit: function emit(evt){
      var listeners = this.keys['*'];
      if (listeners) {
        for (var i=0; i < listeners.length; i++) {
          listeners[i](evt);
        }
      }

      listeners = this.keys[this.lastKey];
      if (listeners) {
        for (var i=0; i < listeners.length; i++) {
          listeners[i](evt);
        }
      }
    },
    on: function on(bind, filter, listener){
      var self = this,
          current = 0,
          events = [],
          keys = bind.split('->');

      if (!listener) {
        listener = filter;
        filter = 'activate';
      }

      if (bind === '*') {

        // wild card listeners for notification on any event
        var listeners = this.keys['*'] || (this.keys['*'] = []);
        listeners.push(function(evt){
          listener.call(self, evt);
        });

      } else if (keys.length > 1) {

        // used an ordered combinator like `a->b->c`
        keys.forEach(function(key, index){
          var listeners = self.keys[key] || (self.keys[key] = []);
          listeners.push(function(evt){
            if (evt.action === 'activate' && events.length === index) {
              events.push(evt);
              if (index === keys.length - 1) {
                listener.apply(self, events);
                events.length = 0;
              }
            } else {
              events.length = 0;
            }
          });
        });

      } else if ((keys = bind.split('+')).length > 1) {

        // used a chorded combinator like `a+b+c`
        keys.forEach(function(key, index){
          var listeners = self.keys[key] || (self.keys[key] = []);
          listeners.push(function(evt){
            if (evt.action === 'activate') {
              current++;
              events[index] = evt;
              if (events.length === keys.length) {
                listener.apply(self, events);
                events.length = 0;
              }
            } else if (evt.action === 'release') {
              current--;
              events[index] = null;
            }
          });
        });

      } else {

        // bound to a single key
        var listeners = self.keys[bind] || (self.keys[bind] = []);
        listeners.push(function(evt){
          if (!filter || evt.action === filter)
            listener.call(self, evt);
        });
      }
    }
  };

  // normalize KeyboardEvent to function closer to the new spec allowing construction and init dicts
  function KeyboardEventInit(init){
    init = Object(init);
    for (var k in KeyboardEventInit.prototype)
      if (k in init)
        this[k] = init[k];
  }

  KeyboardEventInit.prototype = {
    bubbles   : false,
    cancelable: false,
    view      : null,
    detail    : 0,
    char      : "",
    key       : "",
    location  : 0,
    modifiers : "",
    repeat    : false,
    locale    : "",
    charCode  : 0,
    keyCode   : 0,
    which     : 0
  }

  var KBE = window.KeyboardEvent;

  var modMap = {
    Alt: 'altKey',
    AltGraph: 'altGraphKey',
    Control: 'ctrlKey',
    Meta: 'metaKey',
    Shift: 'shiftKey'
  };

  var modState = {
    Alt: function(e){ return !!e.altKey },
    AltGraph: function(e){ return !!(e.altGraphKey || e.ctrlKey && e.altKey) },
    Control: function(e){ return !!(e.ctrlKey || e.altGraphKey) },
    Meta: function(e){ return !!e.metaKey },
    Shift: function(e){ return !!e.shiftKey },
    OS: function(e){ return !!e.metaKey }
  };

  'getModifierState' in KBE.prototype || (KBE.prototype.getModifierState = function getModifierState(key){
    return modState[key](this);
  });

  function normalizeModifiers(init){
    if (init.modifiers) {
      init.modifiers.split(' ').forEach(function(s){
        init[modMap[s]] = true;
      });
    } else {
      var mods = [];
      for (var k in modMap) {
        if (init[modMap[k]])
          mods.push(k);
      }
      init.modifiers = mods.join(' ');
    }
  }

  if ('initKeyEvent' in KBE.prototype) {
    // found mozilla keyboard initializer (up to around FF14)
    var KeyboardEvent = function KeyboardEvent(type, init){
      var evt = document.createEvent('KeyboardEvent');
      init = new KeyboardEventInit(init);
      init.charCode = init.char.charCodeAt(0);
      normalizeModifiers(init);
      evt.initKeyEvent(type, init.bubbles, init.cancelable, init.view, init.ctrlKey, init.altKey,
                             init.shiftKey, init.metaKey, init.keyCode, init.charCode);
      return evt;
    };
  } else {
    // found IE9/WebKit keyboard event initializer
    var KeyboardEvent = function KeyboardEvent(type, init){
      var evt = document.createEvent('KeyboardEvent');
      init = new KeyboardEventInit(init);
      normalizeModifiers(init);
      evt.initKeyboardEvent(type, init.bubbles, init.cancelable, init.view, init.char,
                                  init.location, init.modifiers, init.repeat, init.locale);
      return evt;
    };
  }

  for (var k in Keyboard.LOCATION) {
    Object.defineProperty(KeyboardEvent, 'DOM_KEY_LOCATION_'+k, {
      value: Keyboard.LOCATION[k],
      enumerable: true
    });
  }

  KeyboardEvent.prototype = KBE.prototype;

  Object.defineProperty(KeyboardEvent.prototype, 'constructor', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: KeyboardEvent
  });

  window.KeyboardEvent = KeyboardEvent;


  if (typeof module != 'undefined' && module && module.exports) {
    module.exports = Keyboard;
  } else {
    window.Keyboard = Keyboard;
  }
}([// the ultimate list of keycodes
 'Unknown', 'Mouse1', 'Mouse2', 'Break', 'Mouse3', 'Mouse4', 'Mouse5', '', 'Backspace', 'Tab', '', '',
 'Clear', 'Enter', '', '', 'Shift', 'Control', 'Alt', 'Pause', 'CapsLock', 'IMEHangul', '',
 'IMEJunja', 'IMEFinal', 'IMEKanji', '', 'Escape', 'IMEConvert', 'IMENonconvert', 'IMEAccept',
 'IMEModechange', 'Space', 'PageUp', 'PageDown', 'End', 'Home', 'Left', 'Up', 'Right', 'Down',
 'Select', 'Print', 'Execute', 'PrintScreen', 'Insert', 'Delete', 'Help', '0', '1', '2', '3', '4',
 '5', '6', '7', '8', '9', '', '', '', '', '', '', '', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
 'OSLeft', 'OSRight', 'MetaExtra', '', 'Sleep', 'Numpad0', 'Numpad1', 'Numpad2', 'Numpad3',
 'Numpad4', 'Numpad5', 'Numpad6', 'Numpad7', 'Numpad8', 'Numpad9', 'NumpadMultiply', 'NumpadAdd',
 'NumpadEnter', 'NumpadSubtract', 'NumpadDecimal', 'NumpadDivide', 'F1', 'F2', 'F3', 'F4', 'F5',
 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'F13', 'F14', 'F15', 'F16', 'F17', 'F18', 'F19',
 'F20', 'F21', 'F22', 'F23', 'F24', '', '', '', '', '', '', '', '', 'NumLock', 'ScrollLock', '',
 '', '', '', '', '', '', '', '', '', '', '', '', '', 'ShiftLeft', 'ShiftRight', 'ControlLeft',
 'ControlRight', 'AltLeft', 'AltRight', 'BrowserBack', 'BrowserForward', 'BrowserRefresh',
 'BrowserStop', 'BrowserSearch', 'BrowserFavorites', 'BrowserHome', 'VolumeMute', 'VolumeDown',
 'VolumeUp', 'MediaNextTrack', 'MediaPrevTrack', 'MediaStop', 'MediaPlayPause', 'LaunchMail',
 'SelectMedia', 'LaunchApplication1', 'LaunchApplication2', '', '', ';', '=', ',', '-', '.', '/',
 'DeadGrave', 'DeadAcute', 'DeadCircumflex', 'DeadTilde', 'DeadMacron', 'DeadBreve', 'DeadAboveDot',
 'DeadUmlaut', 'DeadAboveRing', 'DeadDoubleAcute', 'DeadCaron', '', '', '', '', '', '', '', '',
 '', '', '', '', 'DeadCedilla', 'DeadOgonek', '', '', '[', '\\', ']', '\\', 'Meta', 'Meta', '',
 'AltGr', '', '', 'IMEProcess', '', '0x00', '', '', '', '', '', '', '', '', '', '', '', '', '',
 '', 'Attention', 'Crsel', 'Exsel', 'EraseEOF', 'Play', 'Zoom', 'NoName', '', 'Clear', '']));

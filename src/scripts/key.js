module.exports = (function() {
  var keys = {};
  function assure(code) { // Ensure that a key is registered
    if (!keys[code]) {
      keys[code] = {
        down: false,
        tap:  false,
        listeners: {
          tap:  [],
          down: [],
          hold: [],
          up:   []
        }
      };
    }
    return keys[code];
  }
  return {
    SPACE: 32,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40,
    init: function() {
      document.addEventListener("keydown", function(event) {
        var key = keys[event.keyCode];
        if (key) {
          if (!key.tap) {
            key.listeners.tap.some(function(listener) {
              listener.call(window);
            });
            key.tap = true;
          }
          key.down = true;
          key.listeners.down.some(function(listener) {
            listener.call(window);
          });
          function hold() {
            key.listeners.hold.some(function(listener) {
              listener.call(window);
            });
            if (key.down)
              key.holdTimeout = setTimeout(hold, 1000/60);
          }
          hold();
        }
      });
      document.addEventListener("keyup", function(event) {
        var key = keys[event.keyCode];
        if (key) {
          key.down = false;
          key.tap = false;
          key.listeners.up.some(function(listener) {
            listener.call(window);
          });
          clearTimeout(key.holdTimeout);
        }
      });
      return this;
    },
    tap: function(code, callback) {
      var key = assure(code);
      if (callback) {
        key.listeners.tap.push(callback);
        return this;
      } else {
        return null;
      }
    },
    down: function(code, callback) {
      var key = assure(code);
      if (callback) {
        key.listeners.down.push(callback);
        return this;
      } else {
        return key.down;
      }
    },
    hold: function(code, callback) {
      var key = assure(code);
      if (callback) {
        key.listeners.hold.push(callback);
        return this;
      } else {
        return null;
      }
    },
    up: function(code, callback) {
      var key = assure(code);
      if (callback) {
        key.listeners.up.push(callback);
        return this;
      } else {

      }
    }
  };
})();

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function() {
  var app = document.querySelector(".app"),
      worlds = require("./worlds"),
      geometry = require("./geometry"),
      key = require("./key"),
      world;

  function add(id) {
    var item = worlds.create(id);
    if (!world)
      world = item;
    return item;
  }

  function remove(id) {
    worlds.remove(id);
  }

  function init() {
    key.init();
    worlds.init();

    function shuffle(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
      }
    }

    var list = ["mercury", "venus", "earth", "moon", "mars", "ceres", "ganymede", "callisto", "io", "europa", /*"uranus", "neptune",*/ "pluto"];

    shuffle(list);

    list.some(function(world) {
      console.log(world);
      add(world);
    });

    function loop() {
      var dx = 0, dy = 0, data;
      if (key.down(key.LEFT))
        dx -= 1;
      if (key.down(key.RIGHT))
        dx += 1;
      if (key.down(key.UP))
        dy -= 1;
      if (key.down(key.DOWN))
        dy += 1;
      if (dx != 0 || dy != 0)
        world.move(dx, dy);
      worlds.loop();
      requestAnimationFrame(loop);
    }
    loop();
  }
  init();
})();

},{"./geometry":2,"./key":3,"./worlds":4}],2:[function(require,module,exports){
module.exports = (function(){
  function Vector(x, y){
    var o = Vector.resolve(x, y);
    this.x = o.x;
    this.y = o.y;
  }

  Vector.resolve = function(x, y) {
    if (typeof y === "undefined") {
      var t = typeof x;
      if (t === "undefined") {
        throw "Warning: Vector received undefined arguments!";
      } else if (x instanceof Vector) {
        y = x.y;
        x = x.x;
      } else if (x.constructor.name === "Array") {
        y = x[1];
        x = x[0];
      } else if (t === "number") {
        y = 0;
      }
    }
    return {x: x, y: y};
  }

  Vector.unpack = function(value) {
    var values = value.split(",");
    return new Vector(parseFloat(values[0]), parseFloat(values[1]));
  }

  Vector.prototype = {
    resolve:    Vector.resolve,
    add:        function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x += x;
      this.y += y;
      return this;
    },
    added:      function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x + x, this.y + y);
    },
    subtract:   function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x -= x;
      this.y -= y;
      return this;
    },
    subtracted: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x - x, this.y - y);
    },
    multiply: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      this.x *= x;
      this.y *= y;
      return this;
    },
    multiplied: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x * x, this.y * y);
    },
    divide: function(x, y) {
      o = Vector.resolve(x, y);
      this.x /= o.x;
      this.y /= o.y;
      return this;
    },
    divided: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Vector(this.x / x, this.y / y);
    },
    dot: function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return this.x * x + this.y * y;
    },
    normalize: function() {
      var m = this.magnitude();
      if (!m) return this;
      return this.scale(1 / m);
    },
    normalized: function() {
      var m = this.magnitude();
      if (!m) return this;
      return this.scaled(1 / m);
    },
    magnitude: function() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    clone: function() {
      return new Vector(this.x, this.y);
    },
    set: function(x, y){
      o = Vector.resolve(x, y);
      this.x = o.x;
      this.y = o.y;
      return this;
    },
    equals: function(x, y){
      if (x === null) return false;
      o = Vector.resolve(x, y);
      return this.x == o.x && this.y == o.y;
    },
    floor : function() {
      this.x = Math.floor(this.x);
      this.y = Math.floor(this.y);
      return this;
    },
    floored : function() {
      return new Vector(Math.floor(this.x), Math.floor(this.y));
    },
    round : function() {
      this.x = Math.round(this.x);
      this.y = Math.round(this.y);
      return this;
    },
    rounded : function() {
      return new Vector(Math.round(this.x), Math.round(this.y));
    },
    scale: function(scalar) {
      this.x *= scalar;
      this.y *= scalar;
      return this;
    },
    scaled: function(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    },
    dotted: function(other) {
      return this.x * other.x + this.y * other.y;
    },
    string: function(){
      return this.x+", "+this.y;
    },
    pack: function() {
      return this.x+","+this.y;
    }
  }

  function Rect(x, y, width, height){
    var pos, size;

    if (typeof width !== "undefined" && typeof height !== "undefined"){
      pos  = new Vector(x, y);
      size = new Vector(width, height);
    } else {
      pos = x;
      size = y;
    }

    this.pos = pos;
    this.size = size;

    var property, obj;

    for (property in this.properties) {
      obj = this.properties[property];
      Object.defineProperty(this, property, obj);
    }
  }

  Rect.prototype = {
    properties: {
      "left": {
        get: function(){
          return this.pos.x;
        },
        set: function(value){
          this.pos.x = value;
        }
      },
      "right": {
        get: function(){
          return this.pos.x + this.size.x;
        },
        set: function(value){
          this.pos.x = value - this.size.x;
        }
      },
      "top": {
        get: function(){
          return this.pos.y;
        },
        set: function(value){
          this.pos.y = value;
        }
      },
      "bottom": {
        get: function(){
          return this.pos.y + this.size.y;
        },
        set: function(value){
          this.pos.y = value - this.size.y;
        }
      },
      "x": {
        get: function(){
          return this.pos.x;
        },
        set: function(value){
          this.pos.x = value;
        }
      },
      "y": {
        get: function(){
          return this.pos.y;
        },
        set: function(value){
          this.pos.y = value;
        }
      },
      "width": {
        get: function(){
          return this.size.x;
        },
        set: function(value){
          this.size.x = value;
        }
      },
      "height": {
        get: function(){
          return this.size.y;
        },
        set: function(value){
          this.size.y = value;
        }
      },
      "center": {
        get: function(){
          return new Vector(this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2);
        },
        set: function(value){
          this.pos.x = value.x - this.size.x / 2;
          this.pos.y = value.y - this.size.y / 2;
        }
      }
    },
    added:      function(x, y) {
      o = Vector.resolve(x, y);
      x = o.x;
      y = o.y;
      return new Rect(this.pos.x + x, this.pos.y + y, this.size.x, this.size.y);
    },
    clone:      function() {
      return new Rect(this.pos.x, this.pos.y, this.size.x, this.size.y);
    },
    set:        function(x, y, width, height) {
      if (x instanceof Rect) {
        this.pos.x  = x.pos.x;
        this.pos.y  = x.pos.y;
        this.size.x = x.size.x;
        this.size.y = x.size.y;
        return;
      }
      this.pos.x = x;
      this.pos.y = y;
      this.size.x = width;
      this.size.y = height;
    },
    intersects: function(other) {
      if (other instanceof Vector) {
        return this.left < other.x && this.right > other.x && this.top < other.y && this.bottom > other.y;
      } else if (other instanceof Rect) {
        return this.left < other.right && this.right > other.left && this.top < other.bottom && this.bottom > other.top;
      } else {
        return false;
      }
    },
    contains: function(other) {
      if (other instanceof Vector) {
        return other.x > this.left && other.x < this.right && other.y > this.top && other.y < this.bottom;
      } else if (other instanceof Rect) {
        return other.left > this.left && other.right < this.right && other.top > this.top && other.bottom < this.bottom;
      } else {
        return false;
      }
    },
    string: function(){
      return this.left+" -> "+this.right+", "+this.top+" -> "+this.bottom;
    }
  };

  function Circle(pos, radius) {
    this.pos = pos;
    this.radius = radius;
    this.mass = radius;
    this.velocity = new Vector(0, 0);

    var property, obj;

    for (property in this.properties) {
      obj = this.properties[property];
      Object.defineProperty(this, property, obj);
    }
  }

  Circle.unpack = function(data) {
    var circle = new Circle(Vector.unpack(data.pos), data.radius);
    circle.mass = data.mass;
    circle.velocity = Vector.unpack(data.velocity);
    return circle;
  };

  Circle.prototype = {
    properties: {
      "left": {
        get: function(){
          return this.pos.x - this.radius;
        },
        set: function(value){
          this.pos.x = value + this.radius;
        }
      },
      "right": {
        get: function(){
          return this.pos.x + this.radius;
        },
        set: function(value){
          this.pos.x = value - this.radius;
        }
      },
      "top": {
        get: function(){
          return this.pos.y - this.radius;
        },
        set: function(value){
          this.pos.y = value + this.radius;
        }
      },
      "bottom": {
        get: function(){
          return this.pos.y + this.radius;
        },
        set: function(value){
          this.pos.y = value - this.radius;
        }
      },
      "x": {
        get: function(){
          return this.pos.x;
        },
        set: function(value){
          this.pos.x = value;
        }
      },
      "y": {
        get: function(){
          return this.pos.y;
        },
        set: function(value){
          this.pos.y = value;
        }
      },
      "diameter": {
        get: function(){
          return this.radius * 2;
        },
        set: function(value){
          this.radius = value / 2;
        }
      },
      "center": {
        get: function(){
          return this.pos;
        },
        set: function(value){
          this.pos.set(value);
        }
      },
      "rect": {
        get: function(){
          return new Rect(this.pos.x - this.radius, this.pos.y - this.radius, this.radius * 2, this.radius * 2);
        },
        set: function(value){
          this.pos = value.center.clone();
          this.radius = (value.width + value.height) / 4;
        }
      }
    },
    pack: function() {
      return {
        pos: this.pos.pack(),
        radius: this.radius,
        velocity: this.velocity.pack(),
        mass: this.mass
      };
    },
    intersects: function(other) {
      var d, m;
      if (other.rect.intersects(this.rect)) {
        d = other.rect.center.subtracted(this.rect.center);
        m = this.radius + other.radius;
        return d.x * d.x + d.y * d.y < m * m;
      }
    },
    respond: function(other) {
      var d, m, n, t, c, sna, snb, sta, stb, sa, sb, snaa, snab, staa, stab;
      d = other.pos.subtracted(this.pos); // Distance between two circles
      m = other.pos.added(this.pos).scaled(.5);
      n = d.normalized(); // Vector normal
      t = new Vector(-n.y, n.x); // Tangent
      sna = n.dotted(this.velocity);
      snb = n.dotted(other.velocity);
      sta = t.dotted(this.velocity);
      stb = t.dotted(other.velocity);
      sa = (sna * (this.mass - other.mass) + 2 * other.mass * snb) / (this.mass + other.mass);
      sb = (snb * (other.mass - this.mass) + 2 * this.mass * sna) / (other.mass + this.mass);
      snaa = n.scaled(sa);
      snab = n.scaled(sb);
      staa = t.scaled(sta);
      stab = t.scaled(stb);
      this.velocity = staa.added(snaa); // Resulting velocities
      other.velocity = stab.added(snab);

      c = new Vector((this.pos.x * other.radius + other.pos.x * this.radius) / (this.radius + other.radius), (this.pos.y * other.radius + other.pos.y * this.radius) / (this.radius + other.radius)); // Point of collision

      this.pos = c.subtracted(n.scaled(this.radius + 1)); // Addition of 1 avoids circles getting stuck
      other.pos = c.added(n.scaled(other.radius));

      // this.pos = m.added([this.radius, this.radius]).multiplied(this.pos.subtracted(other.pos)).scaled(d.magnitude());
      // other.pos = m.added([other.radius, other.radius]).multiplied(other.pos.subtracted(this.pos)).scaled(d.magnitude());

      var dm = d.magnitude();

      // this.pos = m.subtracted(n.scaled(this.radius));
      // other.pos = m.added(n.scaled(other.radius));

      // console.log(this.pos);

      return this;
    },
    collide: function(other) {
      if (other.intersects(this)) {
        this.respond(other);
      }
    }
  };

  return {
    Vector: Vector,
    Rect: Rect,
    Circle: Circle
  };
})();

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = (function() {
  var geometry = require("./geometry"),
      bounds = new geometry.Rect(0, 0, 640, 480),
      worlds = [],
      scale = 1.25,
      properties = {
        mercury: {
          size: 48,
          mass: 33
        },
        venus: {
          size: 121,
          mass: 486
        },
        earth: {
          size: 127,
          mass: 597
        },
        moon: {
          size: 34,
          mass: 7
        },
        mars: {
          size: 68,
          mass: 64
        },
        ceres: {
          size: 9,
          mass: .0009393
        },
      	europa: {
    			size: 31,
    			mass: 5
      	},
      	io: {
    			size: 36,
    			mass: 9
      	},
      	callisto: {
    			size: 48,
    			mass: 11
      	},
      	ganymede: {
    			size: 52,
    			mass: 15
      	},
      	uranus :{
    			size: 507,
    			mass: 8681
      	},
        neptune: {
    			size: 492,
    			mass: 10243
      	},
        pluto: {
          size: 24,
          mass: 0.01303
        }
      };

  function random(min, max) {
    if (typeof min === "undefined")
      return Math.random();
    if (typeof max === "undefined") {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * max) + min;
  }

  function rgb() {
    return "rgb("+random(255)+", "+random(255)+", "+random(255)+")";
  }

  function World(id) {
    var data;
    this.id = id;
    this.color = null;
    this.body = null;
    this.input = null;
    this.speed = .2;
    this.friction = .98;
    this.element = document.createElement("div");
    this.element.className = "circle" + (id ? " " + id : "");
  }

  World.prototype = {
    create: function(data) {
      var pos, size, world = properties[this.id];
      if (!this.body) {
        pos  = (data && data.pos) ? new geometry.Vector(data.pos) : new geometry.Vector(bounds.center.x, bounds.center.y);
        size = world ? world.size * scale : 48;
        this.body = new geometry.Circle(pos, size / 2);
        world && (this.body.mass = world.mass);
      } else {
        pos = (data && data.pos) ? new geometry.Vector(data.pos) : this.body.pos;
        size = this.body.radius * 2;
      }
      this.reset(pos);
      this.color = (data && data.color ? data.color : null) || this.color || "#427";
      this.element.style.backgroundColor = this.color;
      this.element.style.backgroundImage = "url(../images/"+this.id+".gif)";
      this.element.style.width = size+"em";
      this.element.style.height = size+"em";
      document.querySelector(".app").appendChild(this.element);
      worlds.push(this);
      return this;
    },
    destroy: function(id) {
      document.querySelector(".app").removeChild(this.element);
      if (typeof id === "undefined")
        id = this.id;
      for (var i = 0, max = worlds.length, world; i < max; i ++) {
        world = worlds[i];
        if (id === world.id) {
          id = i;
          break;
        }
      }
      worlds.splice(id, 1);
      return this;
    },
    reset: function(pos) {
      this.body.velocity = new geometry.Vector(0, 0);
      this.body.pos = pos;
    },
    move: function(dx, dy) {
      var d = new geometry.Vector(dx, dy);
      this.body.velocity.add(d.scaled(this.speed));
      return this;
    },
    update: function() {
      this.body.velocity.scale(this.friction);
      this.body.pos.add(this.body.velocity);
      if (this.body.left < bounds.left) {
        this.body.left = bounds.left;
        this.body.velocity.x *= -1;
      }
      if (this.body.right > bounds.right) {
        this.body.right = bounds.right;
        this.body.velocity.x *= -1;
      }
      if (this.body.top < bounds.top) {
        this.body.top = bounds.top;
        this.body.velocity.y *= -1;
      }
      if (this.body.bottom > bounds.bottom) {
        this.body.bottom = bounds.bottom;
        this.body.velocity.y *= -1;
      }
      return this;
    },
    display: function() {
      var pos = new geometry.Vector(this.body.left, this.body.top);//.rounded();
      this.element.style.left = pos.x+"em";
      this.element.style.top = pos.y+"em";
    }
  };

  function init() {
    loop();
  }

  function loop() {
    worlds.some(function(world){
      world.update();
      world.collisionList = [];
    });
    worlds.some(function(world) {
      worlds.some(function(other) {
        if (world !== other) {
          if (world.collisionList.indexOf(other) == -1 && other.collisionList.indexOf(world) == -1) {
            world.body.collide(other.body);
          }
          world.collisionList.push(other);
          other.collisionList.push(world);
        }
      });
      world.display();
    });
  }

  function create(id) {
    var size = properties[id] ? properties[id].size / 2 : 24;
    return new World(id).create({
      pos: new geometry.Vector(random(bounds.left + size, bounds.right - size), random(bounds.top + size, bounds.bottom - size))
    });
  }

  function remove(id) {
    world(id).destroy();
  }

  function player(id) {
    for (var i = 0, max = worlds.length, world; i < max; i ++) {
      world = worlds[i];
      if (id === world.id) {
        return world;
      }
    }
  }


  return {
    rgb: rgb,
    init: init,
    loop: loop,
    create: create,
    remove: remove,

    worlds: worlds,

    World: World,

    bounds: bounds
  };
})();

},{"./geometry":2}]},{},[1])
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

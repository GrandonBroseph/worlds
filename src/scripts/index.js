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

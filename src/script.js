import h from "../lib/h2node"
import morph from "../lib/morph"
import manifest from "../lib/manifest"
import render from "./render"
import worlds from "./worlds.json"

let earth = {
  name: "earth",
  mass: 1,
  hitbox: {
    radius: 64,
    position: [ 0, 0 ]
  },
  velocity: [ 0, 0 ]
}

let moon = {
  name: "moon",
  mass: worlds.moon.mass * earth.mass,
  hitbox: {
    radius: worlds.moon.size * earth.hitbox.radius,
    position: [ -earth.hitbox.radius * 2, 0 ]
  },
  velocity: [ 0, 0 ]
}

let mars = {
  name: "mars",
  mass: worlds.mars.mass * earth.mass,
  hitbox: {
    radius: worlds.mars.size * earth.hitbox.radius,
    position: [ earth.hitbox.radius * 2, 0 ]
  },
  velocity: [ 0, 0 ]
}

let state = {
  sim: {
    friction: 15 / 16,
    worlds: [ earth, moon, mars ]
  },
  viewport: {
    size: [ window.innerWidth, window.innerHeight ],
    position: [ 0, 0 ]
  },
  cursor: {
    position: [ 0, 0 ],
    prev: [ 0, 0 ],
    selection: null
  }
}

let actions = {
  sim: {
    update({ sim }) {
      for (let world of sim.worlds) {
        world.hitbox.position[0] += world.velocity[0]
        world.hitbox.position[1] += world.velocity[1]
        world.velocity[0] *= sim.friction
        world.velocity[1] *= sim.friction
      }
    }
  },
  viewport: {
    resize({ viewport }, width, height) {
      viewport.size[0] = width
      viewport.size[1] = height
    }
  },
  cursor: {
    press({ sim, viewport, cursor }) {
      for (let i = 0; i < sim.worlds.length; i++) {
        let world = sim.worlds[i]
        let center = [
          Math.round(world.hitbox.position[0] + viewport.size[0] / 2),
          Math.round(world.hitbox.position[1] + viewport.size[1] / 2)
        ]
        let d = [
          center[0] - cursor.position[0],
          center[1] - cursor.position[1]
        ]
        let distance = Math.sqrt(Math.pow(d[0], 2) + Math.pow(d[1], 2))
        if (distance < world.hitbox.radius) {
          cursor.selection = { index: i, offset: d }
          break
        }
      }
    },
    move({ sim, viewport, cursor }, x, y) {
      cursor.prev[0] = cursor.position[0]
      cursor.prev[1] = cursor.position[1]
      cursor.position[0] = x
      cursor.position[1] = y
      if (cursor.selection) {
        let world = sim.worlds[cursor.selection.index]
        world.hitbox.position[0] = x + cursor.selection.offset[0] - viewport.size[0] / 2
        world.hitbox.position[1] = y + cursor.selection.offset[1] - viewport.size[1] / 2
      }
    },
    release({ sim, cursor }) {
      if (cursor.selection) {
        let world = sim.worlds[cursor.selection.index]
        world.velocity[0] = cursor.position[0] - cursor.prev[0]
        world.velocity[1] = cursor.position[1] - cursor.prev[1]
        cursor.selection = null
      }
    }
  }
}

let view = manifest(render(h, state))
document.body.appendChild(view)
requestAnimationFrame(loop)

function loop() {
  actions.sim.update(state)
  requestAnimationFrame(loop)
}

function update() {
  morph(view, render(h, state))
}

function distance(a, b) {
  return Math.sqrt(Math.pow(b[0] - a[0], 2) + Math.pow(b[1] - a[1], 2))
}

window.addEventListener("resize", event => {
  actions.viewport.resize(state, window.innerWidth, window.innerHeight)
  update()
})

window.addEventListener("mousedown", event => {
  actions.cursor.press(state)
  update()
})

window.addEventListener("mousemove", event => {
  let x = event.pageX / window.innerWidth * state.viewport.size[0]
  let y = event.pageY / window.innerHeight * state.viewport.size[1]
  actions.cursor.move(state, x, y)
  update()
})

window.addEventListener("mouseup", event => {
  actions.cursor.release(state)
  update()
})


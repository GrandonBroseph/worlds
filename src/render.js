import stringify from "css-string"

export default (h, { sim, viewport }) =>
  h("main", null,
    sim.worlds.map(world =>
      h("div", {
        class: [ "world", world.name ].join(" "),
        style: stringify({
          width: Math.round(world.hitbox.radius * 2) + "px",
          height: Math.round(world.hitbox.radius * 2) + "px",
          left: Math.round(world.hitbox.position[0] - world.hitbox.radius + viewport.size[0] / 2) + "px",
          top: Math.round(world.hitbox.position[1] - world.hitbox.radius + viewport.size[1] / 2) + "px"
        })
      })
    )
  )

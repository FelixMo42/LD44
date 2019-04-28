var buildMenu = [
    {
        name: "wall",
        hp: 100,
        cost: 10,
        draw: (x, y, angle) => {
            for (var i = -2; i <= 2; i++) {
                image(
                    wallImage,
                    x + i * 20 * sin(angle) - 10,
                    y + i * 20 * cos(angle) - 10
                )
            }
        },
        collide: (x, y, angle, cx, cy, radius) => {
            for (var i = -2; i <= 2; i++) {
                var rx = x + i * 20 * sin(angle)
                var ry = y + i * 20 * cos(angle)

                if ((rx - cx) ** 2 + (ry - cy) ** 2 < (radius + 10) ** 2) {
                    return true
                }
            }

            return false
        }
    },
    {
        name: "turret",
        hp: 25,
        cost: 15,
        shotspeed: 2,
        draw: (x, y, angle) => {
            push()

            translate(x, y)
            rotate(-angle + Math.PI / 2)

            image(
                turretImage,
                -30,
                -30
            )

            pop()
        },
        collide: (x, y, angle, cx, cy, radius) => {
            return (x - cx) ** 2 + (y - cy) ** 2 < (radius + 25) ** 2
        },
        update(self, index, dt) {
            if (!self.timer) {
                self.timer = self.shotspeed
            }
            self.timer -= dt
            if (enemies.length == 0) {
                return
            }
            if (!self.target || self.target.dead) {
                self.target = enemies[floor(random(0, enemies.length))]
            }

            this.angle = -createVector(self.target.x - self.x, self.target.y - self.y).heading()

            if (self.timer < 0) {
                self.timer = self.shotspeed

                builds.push({
                    x: self.x,
                    y: self.y,
                    angle: self.angle,
                    timer: 5,
                    hp: 0,
                    draw: (x, y, angle) => {
                        push()

                        translate(x, y)
                        rotate(-angle + Math.PI / 2)

                        image(boltImage, -10, -10)

                        pop()
                    },
                    collide: (x, y, angle, cx, cy, radius) => {
                        return (x - cx) ** 2 + (y - cy) ** 2 < (radius + 10) ** 2
                    },
                    update: (self, index, dt) => {
                        self.x += cos(self.angle) * 500 * dt
                        self.y -= sin(self.angle) * 500 * dt

                        self.timer -= dt

                        if (self.timer < 0) {
                            builds.splice(index, 1)
                        }
                    }
                })
            }
        }
    }
]

function getBuild(name) {
    for (var build of buildMenu) {
        if (build.name === name) {
            return build
        }
    }
}

var selected = -1
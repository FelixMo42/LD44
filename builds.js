var buildMenu = [
    {
        name: "wall",
        hp: 200,
        cost: 5,
        draw: (x, y, angle) => {
            for (var i = -2; i <= 2; i++) {
                circle(x + i * 20 * sin(angle), y + i * 20 * cos(angle), 20)
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
        hp: 50,
        cost: 10,
        draw: (x, y, angle) => {
            push()

            circle(x, y, 50)

            circle(x, y, 20)

            translate(x, y)
            rotate(-angle)

            rect(0, -10, 20, 5, 5)

            rect(0, +5, 20, 5, 5)

            rotate(0)

            pop()
        },
        collide: (x, y, angle, cx, cy, radius) => {
            return (x - cx) ** 2 + (y - cy) ** 2 < (radius + 25) ** 2
        },
        update(self, index, dt) {
            if (!self.timer) {
                self.timer = 1
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
                self.timer = 1

                builds.push({
                    x: self.x,
                    y: self.y,
                    angle: self.angle,
                    timer: 1,
                    hp: 0,
                    draw: (x, y, angle) => {
                        circle(x, y, 20)
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

var selected = -1
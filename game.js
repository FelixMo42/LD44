var started = false

var player = {
    hp: 100,

    x: 0,
    y: 0,

    speed: 300,
    moveCost: 1,

    reach: 100
}

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

var selected = 0

var enemies = []

var builds = []

var originX = 0
var originY = 0

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game")
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function draw() {
    // set up
    var dt = 1/frameRate()
    if (dt < 1) {
        update(dt)
    }
    clear()
    background(41);

    // draw menu
    if (!started) {
        drawMenu()
    }

    originX = windowWidth / 2
    originY = windowHeight / 2

    // draw builds
    builds.forEach((build) => {
        stroke("black"),
        fill("white")
        build.draw(
            build.x + originX,
            build.y + originY,
            build.angle
        )
    })

    // draw enemies
    enemies.forEach((enemie) => {
        fill("#B22222")
        circle(originX + enemie.x, originY + enemie.y, 60)
    })

    // draw player
    fill("#483D8B")
    circle(originX + player.x, originY + player.y, 60)

    // draw build
    if (started && selected > -1 && selected < buildMenu.length) {
        strokeWeight(5)
        let target = createVector(
            mouseX - player.x - originX,
            mouseY - player.y - originY
        )
        target.limit(player.reach + 30)
        let angle = -target.heading()
        target.x += originX + player.x
        target.y += originY + player.y
        
        line(
            originX + player.x, originY + player.y,
            target.x, target.y
        )

        fill(255,255,255,100)
        stroke(0,0,0,100)
        buildMenu[selected].draw(target.x, target.y, angle)
    }

    strokeWeight(1)

    // draw health bar
    stroke("black")
    fill("gray")
    rect(10, 10, windowWidth - 20, 20, 20)
    fill("#B22222")
    rect(10, 10, (windowWidth - 20) * player.hp / 100, 20, 20)
    fill("white")
    textAlign(CENTER, CENTER)
    textSize(20)
    text(floor(player.hp) + " / 100", windowWidth / 2, 21)

    // draw build bar
    startX = windowWidth / 2 - buildMenu.length * 70 / 2
    startY = windowHeight - (60 + 5 + 20 + 5)
    
    fill("gray")
    rect(startX - 5, startY - 5, 70 * buildMenu.length, windowHeight + 10, 20)

    buildMenu.forEach((build, index) => {
        if (index == selected) {
            fill("blue")
        } else {
            fill("white")
        }

        rect(startX + (70 * index), startY, 60, 60, 20)

        textAlign(CENTER, TOP)
        text(build.name, startX + (70 * index) + 30, startY + 60 + 5)
    })
}

function drawMenu() {
    textAlign(CENTER, CENTER)
    textSize(20)
    text("Press any key to start playing!", windowWidth / 2, windowHeight / 2 + 100)

    text("Use arrow keys or wasd to move.", windowWidth / 2, windowHeight / 2 + 200)

    textAlign(CENTER, TOP)
    textSize(30)
    text("TEMP GAME NAME", windowWidth / 2,  100)
}

function update(dt) {
    // player movement
    var movement = createVector()

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
        movement.x -= 1
    }
    
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
        movement.x += 1
    }

    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
        movement.y -= 1
    }
    
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
        movement.y += 1
    }

    movement.setMag(1)

    player.hp -= movement.magSq() * player.moveCost * dt

    player.x += movement.x * player.speed * dt
    player.y += movement.y * player.speed * dt

    // enemy update
    enemies.forEach((enemy, index, list) => {
        let movement = createVector(
            player.x - enemy.x,
            player.y - enemy.y
        ).setMag(1)

        enemy.x += movement.x * enemy.speed * dt
        enemy.y += movement.y * enemy.speed * dt

        if ((enemy.x - player.x) ** 2 + (enemy.y - player.y) ** 2 < 3600) {
            player.hp -= 10
            enemy.dead = true
            list.splice(index, 1)
        }

        builds.forEach((build, i) => {
            if (build.collide(
                build.x, build.y, build.angle,
                enemy.x, enemy.y, 30
            )) {
                enemy.dead = true
                list.splice(index, 1)

                build.hp -= 10

                if (build.hp < 0) {
                    builds.splice(i, 1)
                }
            }
        })
    })

    // build updates
    builds.forEach((build, index) => {
        if (build.update) {
            build.update(build, index, dt)
        }
    })
}

function keyPressed() {
    if (!started) {
        startUp()
    }
    started = true

    if (keyCode >= 49 && keyCode <= 57) {
        selected = keyCode - 49
    }

    if (keyCode == 27) {
        selected = -1
    }
}

function startUp() {
    function spawnEnemy() {
        enemies.push({
            x: random(-500, 500),
            y: random(-500, 500),
            speed: 100
        })
    }
     
    window.setInterval(spawnEnemy, 1000)
}

function mouseClicked() {
    if (!started) {return}

    let target = createVector(
        mouseX - player.x - originX,
        mouseY - player.y - originY
    )
    target.limit(player.reach + 30)
    let angle = -target.heading()
    target.x += player.x
    target.y += player.y

    player.hp -= buildMenu[selected].cost

    builds.push({
        ...buildMenu[selected],
        x: target.x,
        y: target.y,
        angle: angle,
    })
}
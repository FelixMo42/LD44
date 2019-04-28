var started = false
var levelUp = false

var player = {
    hp: 100,
    max: 100,

    x: 0,
    y: 0,

    speed: 300,
    moveCost: 1,

    reach: 100
}

var satan = {
    x: 0,
    y: 0,
    setUp: false
}

var kills = 0

var enemies = []

var builds = []

var originX = 0
var originY = 0

var level = 0

function preload() {
    ghostImage = loadImage('sprites/ghost.png')
    spikeImage = loadImage('sprites/spike.png')
    mcImage = loadImage('sprites/mc.png')
    satanImage = loadImage('sprites/satan.png')
    turretImage = loadImage('sprites/turret.png')
    boltImage = loadImage('sprites/bolt.png')
    wrathImage = loadImage('sprites/wrath.png')
}

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game")
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function dialoge() {
    document.getElementById("text").style.display = "block"
    document.getElementById("text").getElementsByTagName("span")[0].innerHTML = levels[level].dialoge

    var clickCallback = () => {
        document.removeEventListener("click", clickCallback , false);

        deals()
    }

    document.addEventListener("click", clickCallback, false)
}

function deals() {
    document.getElementById("text").style.display = "none"

    document.getElementById("cards").style.display = "flex"
    var upgrades = document.getElementsByClassName("upgrade")
    for (let i = 0; i < upgrades.length; i++) {
        upgrades[i].querySelector("#cost").innerHTML = boons[i][0].cost
        upgrades[i].getElementsByTagName("h1")[0].innerHTML = boons[i][0].name
        upgrades[i].onclick = () => {
            player.max -= boons[i][0].cost
            player.hp = player.max

            boons[i][0].activate()

            document.getElementById("cards").style.display = "none"
            satan.setUp = false
            levelUp = false

            level += 1
        }
    }
}

function draw() {
    // set up
    var dt = 1/frameRate()
    originX = windowWidth / 2
    originY = windowHeight / 2

    if (!levelUp && dt < 1) {
        update(dt)
    }

    if (player.hp < 0) {
        fill("#B22222")
        textSize(50)
        textAlign(CENTER, CENTER)
        text("GAME OVER", windowWidth / 2, windowHeight /2)
        textSize(20)
        text("reload to play again", windowWidth / 2, windowHeight /2 + 50) 
        return
    }

    clear()
    background(41);

    // draw menu
    if (!started) {
        drawMenu()
    }

    drawBuildings(dt)
    drawCharacters(dt)
    drawBuilder(dt)
    drawHealthBar(dt)
    drawBuildBar(dt)
    drawLevelUp(dt)
}

function drawBuildings(dt) {
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
}

function drawCharacters(dt) {
    // draw enemies
    enemies.forEach((enemie) => {
        image({
            wrath: wrathImage,
            lost_soul: ghostImage
        }[enemie.type], originX + enemie.x - 30, originY + enemie.y - 30)
    })

    // draw player
    //fill("#483D8B")
    //circle(originX + player.x, originY + player.y, 60)
    image(mcImage, originX + player.x - 30, originY + player.y - 30)
}

function drawBuilder(dt) {
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
}

function drawHealthBar(dt) {
    strokeWeight(1)

    // draw health bar
    stroke("black")
    fill("gray")
    rect(10, 10, windowWidth - 20, 20, 20)
    fill("#B22222")
    rect(10, 10, (windowWidth - 20) * player.hp / player.max, 20, 20)
    fill("white")
    textAlign(CENTER, CENTER)
    textSize(20)
    text(floor(player.hp) + " / " + player.max, windowWidth / 2, 21)
}

function drawBuildBar(dt) {
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

    fill("white")
    textAlign(LEFT, BOTTOM)
    text(kills + " / " + 25 * 2 ** level + " kills", 10, windowHeight - 10)
}

function drawLevelUp(dt) {
    //
    if (levelUp) {
        selected = -1

        fill("red")
        //circle(originX + satan.x, originY + satan.y, 100)
        image(satanImage, originX + satan.x - 50, originY + satan.y - 50)
        if (!satan.setUp) {
            satan.x = player.x + 300
            satan.y = player.y
            satan.setUp = true
        } else if (satan.x > player.x + 120) {
            satan.x -= 100 * dt
            satan.x = max(satan.x, player.x + 120)
        } else {
            return
        }

        if (satan.x == player.x + 120) {
            satan.x = player.x + 119
            setTimeout(dialoge, 1000)
        }
    }
}

function drawMenu(dt) {
    textAlign(CENTER, CENTER)
    textSize(20)
    text("Press any key to start playing!", windowWidth / 2, windowHeight / 2 + 100)

    text("Use arrow keys or wasd to move.", windowWidth / 2, windowHeight / 2 + 200)

    textAlign(CENTER, TOP)
    textSize(30)
    text("TEMP GAME NAME", windowWidth / 2,  100)
}

function update(dt) {
    updatePlayer(dt)
    updateEnemies(dt)
    updateBuildings(dt)
    spawnEnemy(dt)
}

function updatePlayer(dt) {
    // level

    if (kills >= 25 * 2 ** level) {
        levelUp = true
        kills = 0
    }
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
}

function updateEnemies(dt) {
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
            kills += 1
            list.splice(index, 1)
        }

        builds.forEach((build, i) => {
            if (build.collide(
                build.x, build.y, build.angle,
                enemy.x, enemy.y, 30
            )) {
                kills += 1
                enemy.dead = true
                list.splice(index, 1)

                build.hp -= 10

                if (build.hp < 0) {
                    builds.splice(i, 1)
                }
            }
        })
    })
}

function updateBuildings(dt) {
    // build updates
    builds.forEach((build, index) => {
        if (build.update) {
            build.update(build, index, dt)
        }
    })
}

timer = 1

function spawnEnemy(dt) {
    timer -= dt
    if (timer < 0) {
        timer = 1 - level * .1
        
        for (let t in enemieTypes) {
            enemie = enemieTypes[t]

            if (random() > enemie.chance(level)) {
                continue
            }

            angle = random() * Math.PI * 2

            enemies.push({
                ...enemie,
                x: 100 * cos(angle),
                y: 100 * sin(angle)
            })
        }
    }
}

function keyPressed() {
    started = true

    if (keyCode >= 49 && keyCode <= 57) {
        selected = keyCode - 49
    }

    if (keyCode == 27) {
        selected = -1
    }
}

function mouseClicked() {
    if (levelUp) {return}

    if (selected < 0) {
        return
    }

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
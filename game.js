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

var levels = [
    {
        dialoge: "Hello stranger, you are the most powerful soul I've seen around theses parts in ages. Unlike these petty spirits I have some class, in exchange for a nibble on your soul Ill give you a boon of your choosing."
    }
]

var boons = {
    clubs: [{
        name: "walls"
    }],
    hearts: [{
        name: "turrets"
    }],
    spades: [{
        name: "movement speed"
    }],
    diamonds: [{
        name: "bla"
    }]
}

var kills = 0

var enemies = []

var builds = []

var originX = 0
var originY = 0

var level = 0

function setup() {
    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent("game")
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function setUpThing() {
    document.getElementById("text").style.display = "block"


    var clickCallback = () => {
        document.removeEventListener("click", clickCallback , false);

        nextThing()
    }

    document.addEventListener("click", clickCallback, false)
}

function nextThing() {
    document.getElementById("text").style.display = "none"

    document.getElementById("cards").style.display = "flex"
    var upgrades = document.getElementsByClassName("upgrade")
    for (var upgrade of upgrades) {
        upgrade.onclick = () => {
            player.hp = player.max

            document.getElementById("cards").style.display = "none"
            print(document.getElementById("cards"))
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
    rect(10, 10, (windowWidth - 20) * player.hp / player.max, 20, 20)
    fill("white")
    textAlign(CENTER, CENTER)
    textSize(20)
    text(floor(player.hp) + " / " + player.max, windowWidth / 2, 21)

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

    //
    if (levelUp) {
        selected = -1

        fill("red")
        circle(originX + satan.x, originY + satan.y, 100)

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
            setTimeout(setUpThing, 1000)
        }
    }
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
        if (levelUp) {
            return
        }
        enemies.push({
            x: random(-500, 500),
            y: random(-500, 500),
            speed: 100
        })
    }
     
    window.setInterval(spawnEnemy, 1000)
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
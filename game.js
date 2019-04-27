var started = false

var player = {
    hp: 100,

    x: 0,
    y: 0,

    speed: 300,
    moveCost: 1
}

var buildMenu = [
    {
        name: "wall"
    },
    {
        name: "turret"
    }
]

var selected = 0

var enemies = []

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


    var originX = windowWidth / 2
    var originY = windowHeight / 2

    // draw enemies
    enemies.forEach((enemie) => {
        fill("#B22222")
        circle(originX + enemie.x, originX + enemie.y, 60)
    })

    // draw player
    fill("#483D8B")
    circle(originX + player.x, originX + player.y, 60)

    // draw build
    if (selected > -1 && selected < buildMenu.length) {
        
    }

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

            list.splice(index, 1);
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
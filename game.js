var player = {
    hp: 100,

    x: 0,
    y: 0,

    speed: 300
}

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

    // draw player
    fill("#483D8B")
    circle(windowWidth / 2 + player.x, windowHeight / 2 + player.y, 60)

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
}

function update(dt) {

    //player movement
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

    player.hp -= movement.magSq() * 10 * dt

    player.x += movement.x * player.speed * dt
    player.y += movement.y * player.speed * dt
}
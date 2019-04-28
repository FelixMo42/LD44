var enemieTypes = {
    lost_soul: {
        type: "lost_soul",
        speed: 100,
        damage: 10,
        hp: 1,
        chance: (level) => 1
    },
    wrath: {
        type: "wrath",
        speed: 250,
        damage: 20,
        hp: 1,
        chance: (level) => level / 5
    },
    wrath: {
        type: "zombie",
        speed: 80,
        damage: 50,
        hp: 3,
        chance: (level) => level / 10
    },
    willowisp: {
        type: "willowisp",
        speed: 80,
        damage: 10,
        hp: 5,
        chance: (level) => (level + 1) / 10
    },
    caster: {
        type: "caster",
        speed: 80,
        damage: 0,
        hp: 1,
        timer: 5,
        chance: (level) => (level - 1) / 10,
        update: (self, dt) => {
            let movement = createVector(
                player.x - self.x,
                player.y - self.y
            ).setMag(1)

            self.timer -= dt
            if (self.timer < 0) {
                enemies.push({
                    type: "fireball",
                    x: self.x,
                    y: self.y,
                    speed: 500,
                    damage: 10,
                    hp: 1,
                    count: 0,
                    update: (self, dt) => {
                        self.hp -= dt

                        self.x += movement.x * self.speed * dt
                        self.y += movement.y * self.speed * dt
                    }
                })

                self.timer = 1.5
            }

            self.x += movement.x * self.speed * dt
            self.y += movement.y * self.speed * dt
        }
    }
}
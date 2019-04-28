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
    }
}
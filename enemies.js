var enemieTypes = {
    lost_soul: {
        type: "lost_soul",
        speed: 100,
        damage: 10,
        chance: (level) => 1
    },
    wrath: {
        type: "wrath",
        speed: 150,
        damage: 20,
        chance: (level) => level / 5
    }
}
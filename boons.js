var boons = [
    [{
        name: "increase wall health",
        cost: 5,
        activate: () => {
            getBuild("wall").hp += 50
        }
    }],
    [{
        name: "increase turret shot speed",
        cost: 5,
        activate: () => {
            getBuild("wall").shotspeed -= .25
        }
    }],
    [{
        name: "increase movement speed",
        cost: 5,
        activate: () => {
            player.speed += 100
        }
    }],
    [{
        name: "decrease wall cost",
        cost: 5,
        activate: () => {
            getBuild("wall").cost = 5
        }
    },
    {
        name: "decrease wall cost",
        cost: 5,
        activate: () => {
            getBuild("wall").cost = 1
        }
    }]
]
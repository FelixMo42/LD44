var boons = [
        // wall health //
    [{
        name: "increase wall health",
        cost: 3,
        card: "3_of_hearts",
        activate: () => {
            getBuild("wall").hp += 50
        }
    },{
        name: "increase wall health",
        cost: 9,
        card: "9_of_hearts",
        activate: () => {
            getBuild("wall").hp += 100
        }
    }],
        // turret shot speed //
    [{
        name: "increase turret shot speed",
        cost: 5,
        card: "5_of_clubs",
        activate: () => {
            getBuild("turret").shotspeed -= .25
        }
    },{
        name: "increase turret shot speed",
        cost: 10,
        card: "10_of_clubs",
        activate: () => {
            getBuild("turret").shotspeed -= .25
        }
    },{
        name: "increase turret shot speed",
        cost: 15,
        card: "ace_of_clubs",
        activate: () => {
            getBuild("turret").shotspeed -= .25
        }
    }],
        // movement speed //
    [{
        name: "increase movement speed",
        cost: 2,
        card: "2_of_hearts",
        activate: () => {
            player.speed += 50
        }
    },{
        name: "increase movement speed",
        cost: 4,
        card: "4_of_hearts",
        activate: () => {
            player.speed += 50
        }
    },{
        name: "increase movement speed",
        cost: 6,
        card: "6_of_hearts",
        activate: () => {
            player.speed += 50
        }
    },{
        name: "increase movement speed",
        cost: 8,
        card: "8_of_hearts",
        activate: () => {
            player.speed += 50
        }
    }],
        // wall cost //
    [{
        name: "decrease wall cost",
        cost: 5,
        card: "5_of_hearts",
        activate: () => {
            getBuild("wall").cost = 5
        }
    }, {
        name: "decrease wall cost",
        cost: 11,
        card: "jack_of_hearts",
        activate: () => {
            getBuild("wall").cost = 1
        }
    }]
]
const events = {
    "Batteries": {
        script:[
            {
                text: "You land in the middle of a vast plain."
            },
            {
                text: "You come across a small abandoned building in a vast plain. There is a model wind turbine outside the building. You can take the wind turbine apart for dust, or let it generate energy. What do you do?",
                choice: [
                    {
                        text: "Take it apart",
                        goto: 2,
                    },
                    {
                        text: "Generate Energy",
                        goto: 3
                    }
                ]
            },
            {
                text: "You took apart the wind turbine and gained 10 dust.",
                item: {
                    dust: 10,
                },
                endEvent: true,
                eventResolved: true,
            },
            {
                text: "You let the turbine generate energy for a while. You gain 100 energy.",
                item: {
                    energy: 100,
                },
                endEvent: true,
                eventResolved: true,
            }
            ]
    },
    "Research Station": {
        script: [
            {
                text: "The ship flies over a research station."
            },
            {
                text: "You found a hard drive lying around and gained a research point.",
                item: {
                    researchPoints: 1
                }
            },
            {
                probability: 0.5,
                text: "You also found the station's energy supplies, and gain 100 energy.",
                item: {
                    energy: 100
                },
            },
            {
                text: "You leave the research station",
                eventResolved: true,
            }
        ]
    },
    "Warp Drive": {
        script: [
            {
                text: "You arrive at the planet, but before landing, a large orbital station glimmering in the white starlight catches your attention."
            },
            {
                text: "You pull up next to the station, but the landing bay is broken and requires 5 iridium to fix.",
                choice: [
                    {
                        text: "Fix it",
                        cost: {
                            iridium: 5
                        },
                        goto: 2,
                    },
                    {
                        text: "Leave",
                        goto: 4
                    }
                ]
            },
            {
                text: "You fixed the station, but you still need energy to get the station doors to open.",
                choice: [
                    {
                        text: "Supply energy",
                        cost: {
                            energy: 100
                        },
                        goto: 3
                    },
                    {
                        text: "Leave",
                        goto: 4
                    }
                ]
            },
            {
                text: "Success! You manage to enter the research station, and inside, you find the blueprints for a warp drive. Perhaps you can jump between star systems with this?",
                researchUnlocked: ["Warp Drive"],
                endEvent: true,
                eventResolved: true
            },
            {
                text: "You leave the station for another day.",
                endEvent: true,
                eventResolved: false,
            }
        ]
    },
    "Harvest Sand": {
        script: [
            {
                text: "Your ship flies over vast sand dunes reflecting the glimmer of starlight, before landing."
            },
            {
                text: "Mixed in the vast sand dunes are some bits of dust. You gained 50 dust.",
                item: {
                    dust: 50
                }
            },
            {
                text: "You wonder who left the bits of dust there for you.",
                eventResolved: true
            }
        ]
    },
    "solarPanels1": {
        script: [
            {
                text: "The turbulence weakens as your ship breaks through the bottom layer of clouds. In front of you, you see an ocean reaching out to the distant skies above, waves reflecting the gentle droplets of sunshine raining down from the heavens."
            },
            {
                text: "And, as your ship descends further and further, you begin to make out patches of greenery among the waves — patches of island among the endless water."
            },
            {
                text: "The scenery offers a pleasing and transquil view, but you wonder if that's all the planet has in store for you. Then, out of the corner of your eye, a fleeting reflection of sunlight catches your attention."
            },
            {
                text: "You steer your ship towards the light. It leads you to an island like many others, except for one small detail: a large solar panel feeding power to a small white lab. You don't know what the building is used for, but you do know: you can use the solar panel to power your ship.",
                item: {
                    solarPanel: 1
                }
            },
            {
                text: "Solar panels are difficult to come by in this universe. Better look after this one; it will serve you well.",
                eventResolved: true
            }
        ]
    }
}

export default events;
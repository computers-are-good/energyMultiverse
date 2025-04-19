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
                text: "You took apart the wind turbine and gained 30 dust.",
                item: {
                    dust: 30,
                },
                endEvent: true,
                eventResolved: true,
            },
            {
                text: "You let the turbine generate energy for a while. You gain 200 energy.",
                item: {
                    energy: 200,
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
    }
}

export default events;